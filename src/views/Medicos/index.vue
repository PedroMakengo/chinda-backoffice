<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import Title from "@/components/Title/index.vue";
import { UsecaseListaMedicos } from "@/Domain/Usecases/Medicos/usecase_lista_medicos";
import { UsecaseListaMedicosEspecializacao } from "@/Domain/Usecases/Medicos/usecase_lista_medicos_especializacao";
import { UsecaseListaEspecializacoes } from "@/Domain/Usecases/Especializacoes/usecase_lista_especializacoes";
import { UsecaseListaProvincias } from "../../Domain/Usecases/Provincias/usecase_lista_provincias";

export default defineComponent({
  components: { Title },
  setup() {
    // VARIAVIES
    const loading = ref(false);
    const search = ref("");
    const cabecalhoTabela = ref<any>([
      { key: "itens", title: "#" },
      { key: "nome", title: "Nome" },
      { key: "sobrenome", title: "Sobrenome" },
      { key: "telefone", title: "Telefone" },
      { key: "especializacao.descricao", title: "Especialização" },
      { key: "precoConsulta", title: "Preço Consulta" },
      { key: "accoes", title: "Acções", sortable: false },
    ]);
    const dataListaMedicos = ref<any>([]);
    const dataEspecializacao = ref<any>([]);
    const dataProvincias = ref<any>([]);
    const forms = ref({
      especializacao: undefined!,
      provincia: undefined!,
    });

    // FUNCÇÕES
    const buscarProvincias = async () => {
      const response = await UsecaseListaProvincias.handler();
      dataProvincias.value = response?.object.items;
    };

    const buscarEspecializacao = async () => {
      const response = await UsecaseListaEspecializacoes.handler();
      dataEspecializacao.value = response?.object.items;
    };

    const buscarMedicosPorEspecializacao = async (especializacao: number) => {
      const response = await UsecaseListaMedicosEspecializacao.handler(
        especializacao
      );

      dataListaMedicos.value = response?.object.items;
      dataListaMedicos.value.forEach((item: any, index: number) => {
        item["itens"] = index + 1;
      });
    };

    const buscarListaMedidos = async () => {
      const query = `?page=1&take=100`;
      const response = await UsecaseListaMedicos.handler(query);
      dataListaMedicos.value = response?.object.items;

      dataListaMedicos.value.forEach((item: any, index: number) => {
        item["itens"] = index + 1;
      });
    };

    const onRefreshDataAprrovad = async () => {
      loading.value = true;
      await buscarListaMedidos();

      loading.value = false;
    };

    watch(
      () => forms.value.especializacao,
      () => {
        if (forms.value.especializacao !== undefined)
          buscarMedicosPorEspecializacao(forms.value.especializacao);
      }
    );
    onMounted(() => {
      buscarListaMedidos();
      buscarEspecializacao();
      buscarProvincias();
    });

    return {
      forms,
      search,
      loading,
      cabecalhoTabela,
      dataListaMedicos,
      dataEspecializacao,
      dataProvincias,
      onRefreshDataAprrovad,
    };
  },
});
</script>
<template>
  <div class="container">
    <Title title="MÉDICOS" />

    <div class="container mt-4">
      <div class="bg-white">
        <v-col align="right">
          <v-btn color="green" @click="onRefreshDataAprrovad">Atualizar</v-btn>
        </v-col>

        <v-card-title>
          <form>
            <v-row class="mt-4">
              <v-col cols="12" md="3">
                <v-autocomplete
                  label="Província"
                  :items="dataProvincias"
                  item-value="id"
                  item-title="nome"
                  v-model="forms.provincia"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  label="Especialização"
                  :items="dataEspecializacao"
                  item-value="id"
                  item-title="descricao"
                  v-model="forms.especializacao"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn color="blue">Pesquisar</v-btn>
              </v-col>
            </v-row>
          </form>

          <v-spacer></v-spacer>
          <v-text-field
            append-inner-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            v-model="search"
          ></v-text-field>
        </v-card-title>

        <v-data-table
          :headers="cabecalhoTabela"
          :search="search"
          :items="dataListaMedicos"
          :loading="loading"
        >
          <template v-slot:[`item.accoes`]="{ item }">
            <v-menu transition="slide-x-transition">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" size="small" v-bind="props">
                </v-btn>
              </template>
              <v-list>
                <v-list-item :value="1">
                  <v-list-item-title>Detalhes</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.borderItems {
  background: #eff4f8;
  margin-bottom: 1rem;
  padding: 0.6rem;

  text-transform: uppercase;
  font-weight: bold;
}
</style>
