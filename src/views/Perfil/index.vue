<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Title from "@/components/Title/index.vue";

import { UsecaseListaPerfis } from "@/Domain/Usecases/Perfis/usecase_lista_perfis";
import { UsecaseAdicionarPerfil } from "@/Domain/Usecases/Perfis/usecase_add_perfis";
import TitleModal from "@/components/TitleModal/index.vue";

import { useToast } from "vue-toastification";

export default defineComponent({
  components: { Title, TitleModal },
  setup() {
    // VARIAVEIS
    const toast = useToast();
    const modalAddPerfis = ref(false);
    const loading = ref(false);
    const dataListaPerfis = ref<any>([]);
    const cabecalhoTabela = ref([
      { key: "itens", title: "#" },
      { key: "name", title: "Descrição" },
      { key: "accoes", title: "Acções", sortable: false },
    ]);
    const search = ref("");

    const form = ref<any>({
      tipoPerfil: undefined!,
      descricao: undefined!,
    });

    // FUNÇÕES
    const buscarListaPerfis = async (query?: string) => {
      const response = await UsecaseListaPerfis.handler(query);
      const data = response?.object;
      dataListaPerfis.value = data.items;

      dataListaPerfis.value.forEach((item: any, index: number) => {
        item["itens"] = index + 1;
      });
    };

    const onSubmitAddPerfis = async () => {
      const data = {
        tipoPerfil: form.value.tipo,
        descricao: form.value.descricao,
      };

      const response = await UsecaseAdicionarPerfil.store(data);

      if (response?.success) {
        toast.success("Perfil adicionado com sucesso", {
          timeout: 3000,
        });
        buscarListaPerfis("");
        form.value.descricao = undefined;
        form.value.tipo = undefined;
        modalAddPerfis.value = false;
      } else {
        toast.success("Não foi possível adicionar o perfil", {
          timeout: 3000,
        });
      }
    };

    const onRefreshData = async () => {
      loading.value = true;

      await buscarListaPerfis("");

      loading.value = false;
    };

    onMounted(() => {
      buscarListaPerfis("");
    });

    return {
      loading,
      search,
      form,
      onRefreshData,
      modalAddPerfis,
      onSubmitAddPerfis,
      cabecalhoTabela,
      dataListaPerfis,
    };
  },
});
</script>

<template>
  <div class="container">
    <Title title="PERFIL" />

    <div class="container bg-white mt-4">
      <div class="table">
        <v-col align="right">
          <v-btn color="green" class="mr-2" @click="onRefreshData"
            >Atualizar</v-btn
          >
          <v-btn color="blue" @click="modalAddPerfis = true">Adicionar</v-btn>
        </v-col>
        <v-card-title>
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
          :items="dataListaPerfis"
          :loading="loading"
        >
          <template v-slot:[`item.accoes`]="{ item }">
            <v-menu transition="slide-x-transition">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" size="small" v-bind="props">
                </v-btn>
              </template>
              <v-list>
                <v-list-item :value="0">
                  <v-list-item-title>Editar</v-list-item-title>
                </v-list-item>

                <v-list-item :value="1">
                  <v-list-item-title>Remover</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </div>
    </div>

    <v-dialog v-model="modalAddPerfis" width="35%" persistent>
      <v-card>
        <TitleModal title="Adicionar Perfil" @fechar="modalAddPerfis = false" />
        <v-card-text>
          <div class="formulario">
            <form class="spacing" @submit.prevent="onSubmitAddPerfis">
              <v-row class="pt-4 pb-4">
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="form.tipo"
                    label="Tipo Perfil"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-textarea
                    v-model="form.descricao"
                    clearable
                    label="Descrição"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" align="right">
                  <v-btn type="submit" color="blue"> Salvar </v-btn>
                </v-col>
              </v-row>
            </form>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
