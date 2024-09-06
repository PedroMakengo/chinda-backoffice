<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import Title from "@/components/Title/index.vue";
import { UsecaseListaMedicos } from "@/Domain/Usecases/Medicos/usecase_lista_medicos";
import { UsecaseListaMedicosEspecializacao } from "@/Domain/Usecases/Medicos/usecase_lista_medicos_especializacao";
import { UsecaseListaMedicosPorId } from "@/Domain/Usecases/Medicos/usecase_lista_medicos_id";
import { UsecaseListaEspecializacoes } from "@/Domain/Usecases/Especializacoes/usecase_lista_especializacoes";
import { UsecaseListaProvincias } from "@/Domain/Usecases/Provincias/usecase_lista_provincias";
import { FormatarData } from "@/utils/formatarData";

export default defineComponent({
  components: { Title },
  setup() {
    // VARIAVIES
    const loading = ref(false);
    const modalDetalhesMedicos = ref(false);
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

    const dataVinculo = ref<any>([]);
    const dataListaMedicos = ref<any>([]);
    const dataMedico = ref<any>([]);
    const dataEspecializacao = ref<any>([]);
    const dataProvincias = ref<any>([]);
    const dataObjecto = ref<any>({});
    const forms = ref<any>({
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

    const buscarMedicoPorId = async (id: number | string) => {
      const response = await UsecaseListaMedicosPorId.handler(id);

      dataMedico.value = response?.object;

      console.log(dataMedico.value);
    };

    const onRefreshDataAprrovad = async () => {
      loading.value = true;

      await buscarListaMedidos();

      loading.value = false;
    };

    const onRemoveFilter = () => {
      onRefreshDataAprrovad();
      forms.value.especializacao = undefined;
      forms.value.provincia = undefined;
    };

    const handlerDetalhesMedicos = (item: any) => {
      dataVinculo.value = item.vinculos;
      buscarMedicoPorId(item.id);
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
      onRemoveFilter,
      modalDetalhesMedicos,
      FormatarData,
      handlerDetalhesMedicos,
      dataMedico,
      dataObjecto,
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
                <v-btn color="blue" class="mr-2">Pesquisar</v-btn>
                <v-btn color="orange" class="text-white" @click="onRemoveFilter"
                  >Limpar Filtro</v-btn
                >
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
                <v-list-item :value="1" @click="handlerDetalhesMedicos(item)">
                  <v-list-item-title>Detalhes </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- MODAL -->
    <v-dialog v-model="modalDetalhesMedicos" width="85%" persistent>
      <v-card>
        <TitleModal
          title="Detalhes Pedido de Inscrição"
          @fechar="modalDetalhesMedicos = false"
        />
        <v-card-text>
          <div class="formulario">
            <form class="spacing">
              <v-row class="pt-4 pb-4">
                <v-col cols="12" md="4">
                  <v-text-field
                    clearable
                    label="Processo"
                    variant="outlined"
                    v-model="dataObjecto.processo"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    clearable
                    label="Nome"
                    variant="outlined"
                    v-model="dataObjecto.nome"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    clearable
                    label="Sobrenome"
                    variant="outlined"
                    v-model="dataObjecto.sobrenome"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    clearable
                    label="Telefone"
                    variant="outlined"
                    v-model="dataObjecto.telefone"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="8">
                  <v-autocomplete
                    clearable
                    label="Especialização"
                    variant="outlined"
                    :items="dataEspecializacao"
                    v-model="dataObjecto.especializacao"
                    item-title="descricao"
                    item-value="id"
                    readonly
                  ></v-autocomplete>
                </v-col>
              </v-row>

              <v-row class="mt-4 pt-4">
                <v-col>
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="12" md="12">
                  <h2>Vínculos</h2>
                </v-col>

                <!-- LISTAGEM DE TODOS OS VÍNCULOS -->
                <v-col
                  md="12"
                  cols="6"
                  v-for="(el, index) in dataVinculo"
                  :key="index"
                >
                  <div class="card">
                    <div class="card-content">
                      <div class="card-image">
                        {{ el.hospital[0] }}
                      </div>
                      <div class="card-descricao">
                        <h4>{{ el.hospital }}</h4>
                        <span class="item-cidade"
                          >{{ el.cidade }} - {{ el.pais }}</span
                        >
                        <h5>
                          {{ FormatarData(el.dataInicio) }} -
                          {{ FormatarData(el.dataFim) }}
                        </h5>
                      </div>
                    </div>
                  </div>
                </v-col>
                <!-- LISTAGEM DE TODOS OS VÍNCULOS -->
              </v-row>

              <v-row class="mt-4 pt-4">
                <v-col>
                  <v-divider></v-divider>
                </v-col>
                <v-col cols="12" md="12">
                  <h2>Arquivos</h2>
                </v-col>

                <!-- LISTAGEM DE TODOS OS VÍNCULOS -->

                <!-- <template v-if="loadingProcessamentoArquivos">
                  <v-col cols="12" md="12">
                    <v-skeleton-loader type="paragraph"></v-skeleton-loader>
                  </v-col>
                </template>

                <div v-else>
                  <v-col cols="12" md="12" class="mt-2 mb-2">
                    <div v-if="dataArquivos.length > 0">
                      <template
                        v-for="(el, index) in dataArquivos"
                        :key="index"
                      >
                        <v-chip
                          color="green"
                          class="mr-2 mb-2"
                          label
                          @click="handleOpen(el.content)"
                        >
                          {{ el.nome }}
                        </v-chip>
                      </template>
                    </div>

                    <div v-else>
                      <p>Não existe nenhum arquivo</p>
                    </div>
                  </v-col>
                </div> -->
                <!-- LISTAGEM DE TODOS OS VÍNCULOS -->
              </v-row>
            </form>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- END MODAL -->
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
