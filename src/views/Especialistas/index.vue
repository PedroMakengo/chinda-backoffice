<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Title from "@/components/Title/index.vue";
import TitleModal from "@/components/TitleModal/index.vue";
import { UsecaseListaEspecializacoes } from "@/Domain/Usecases/Especializacoes/usecase_lista_especializacoes";
import { UsecaseDeleteEspecializacoes } from "@/Domain/Usecases/Especializacoes/usecase_remover_especializacoes";
import { UsecaseAdicionarEspecializacoes } from "@/Domain/Usecases/Especializacoes/usecase_adicionar_especializacoes";
import { UsecaseEditarEspecializacoes } from "@/Domain/Usecases/Especializacoes/usecase_editar_especializacoes";

import { useToast } from "vue-toastification";

export default defineComponent({
  components: { Title, TitleModal },
  setup() {
    // VARIAVEIS

    const toast = useToast();
    const search = ref("");
    const loading = ref(false);
    const modalAddEspecializacao = ref(false);
    const modalEditEspecializacao = ref(false);
    const dataListaEspecializacao = ref<any>([]);
    const cabecalhoTabela = ref([
      { key: "itens", title: "#" },
      { key: "descricao", title: "Descrição" },
      { key: "accoes", title: "Acções", sortable: false },
    ]);

    const form = ref<any>({
      descricao: undefined!,
      idEspecializacao: "",
    });

    // FUNÇÕES
    const buscarListaEspecializacao = async (query?: string) => {
      const response = await UsecaseListaEspecializacoes.handler(query);
      const data = response?.object;

      dataListaEspecializacao.value = data.items;

      dataListaEspecializacao.value.forEach((item: any, index: number) => {
        item["itens"] = index + 1;
      });
    };

    const onSubmitDeleteEspecializacao = async (id: string) => {
      const response = await UsecaseDeleteEspecializacoes.store(id);

      if (response?.success) {
        toast.success("Especialização eliminada com sucesso", {
          timeout: 3000,
        });

        buscarListaEspecializacao("");
      } else {
        toast.success("Não foi possível efetuar está operação", {
          timeout: 3000,
        });
      }
    };

    const onSubmitAddEspecializacao = async () => {
      const data = {
        descricao: form.value.descricao,
      };
      const response = await UsecaseAdicionarEspecializacoes.store(data);

      console.log(data);

      if (response?.success) {
        toast.success("Especialização adicionado com sucesso", {
          timeout: 3000,
        });

        buscarListaEspecializacao("");

        form.value.descricao = undefined;
        modalAddEspecializacao.value = false;
      } else {
        toast.error("Não foi possível adicionar especialização!", {
          timeout: 3000,
        });
      }
    };

    const onSubmitEditEspecializacao = async () => {
      const id = form.value.idEspecializacao;
      const data = {
        descricao: form.value.descricao,
      };

      const response = await UsecaseEditarEspecializacoes.store(id, data);

      if (response?.success) {
        toast.success("Especialização editada com sucesso", {
          timeout: 3000,
        });

        modalEditEspecializacao.value = false;
        await buscarListaEspecializacao("");
      } else {
        toast.error("Não foi possível efetuar está operação!", {
          timeout: 3000,
        });
      }
    };

    const onEditModal = (item: any) => {
      modalEditEspecializacao.value = true;
      form.value.idEspecializacao = item.id;
      form.value.descricao = item.descricao;
    };

    const onRefreshData = async () => {
      loading.value = true;

      await buscarListaEspecializacao("");

      loading.value = false;
    };

    onMounted(() => {
      buscarListaEspecializacao("");
    });

    return {
      form,
      search,
      loading,
      cabecalhoTabela,
      dataListaEspecializacao,
      modalAddEspecializacao,
      modalEditEspecializacao,
      onRefreshData,
      onEditModal,
      onSubmitEditEspecializacao,
      onSubmitAddEspecializacao,
      onSubmitDeleteEspecializacao,
    };
  },
});
</script>

<template>
  <div class="container">
    <Title title="ESPECIALIZAÇÃO" />

    <div class="container mt-4 bg-white">
      <div class="table">
        <v-col align="right">
          <v-btn color="green" class="mr-2" @click="onRefreshData"
            >Atualizar</v-btn
          >
          <v-btn color="blue" @click="modalAddEspecializacao = true"
            >Adicionar</v-btn
          >
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
          :loading="loading"
          :items="dataListaEspecializacao"
        >
          <template v-slot:[`item.accoes`]="{ item }">
            <v-menu transition="slide-x-transition">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" size="small" v-bind="props">
                </v-btn>
              </template>
              <v-list>
                <v-list-item :value="0" @click.prevent="onEditModal(item)">
                  <v-list-item-title>Editar</v-list-item-title>
                </v-list-item>
                <v-list-item
                  :value="1"
                  @click.prevent="onSubmitDeleteEspecializacao(item.id)"
                >
                  <v-list-item-title>Remover</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </div>

      <!-- ADICIONAR -->
      <v-dialog v-model="modalAddEspecializacao" width="35%" persistent>
        <v-card>
          <TitleModal
            title="Adicionar Especialização"
            @fechar="modalAddEspecializacao = false"
          />
          <v-card-text>
            <div class="formulario">
              <form class="spacing" @submit.prevent="onSubmitAddEspecializacao">
                <v-row class="pt-4 pb-4">
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
      <!-- ADICIONAR -->

      <!-- EDITAR -->
      <v-dialog v-model="modalEditEspecializacao" width="35%" persistent>
        <v-card>
          <TitleModal
            :title="`Atualizar Especialização - ${form.idEspecializacao}`"
            @fechar="modalEditEspecializacao = false"
          />
          <v-card-text>
            <div class="formulario">
              <form
                class="spacing"
                @submit.prevent="onSubmitEditEspecializacao"
              >
                <v-row class="pt-4 pb-4">
                  <v-col>
                    <v-textarea
                      v-model="form.descricao"
                      clearable
                      label="Descrição"
                      variant="outlined"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" align="right">
                    <v-btn type="submit" color="blue"> Editar </v-btn>
                  </v-col>
                </v-row>
              </form>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- EDITAR -->
    </div>
  </div>
</template>
