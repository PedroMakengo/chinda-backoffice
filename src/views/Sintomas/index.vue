<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

import { UsecaseListaSintomas } from "@/Domain/Usecases/Sintomas/usecase_lista_sintomas";
import { UsecaseAdicionarSintomas } from "@/Domain/Usecases/Sintomas/usecase_adicionar_sintomas";

import Title from "@/components/Title/index.vue";
import TitleModal from "@/components/TitleModal/index.vue";

import { useToast } from "vue-toastification";

export default defineComponent({
  components: { Title, TitleModal },
  setup() {
    // VARIAVEIS
    const toast = useToast();

    const modalAddSintoma = ref(false);
    const loading = ref(false);

    const search = ref("");
    const dataListaSintomas = ref<any>([]);
    const cabecalhoTabela = ref([
      { key: "itens", title: "#" },
      { key: "descricao", title: "Descrição" },
      { key: "accoes", title: "Acções", sortable: false },
    ]);

    const form = ref<any>({
      descricao: undefined!,
    });

    // FUNÇÕES
    const buscarListaSintomas = async (query?: string) => {
      const response = await UsecaseListaSintomas.handler(query);
      const data = response?.object;
      dataListaSintomas.value = data.items;

      dataListaSintomas.value.forEach((item: any, index: number) => {
        item["itens"] = index + 1;
      });
    };

    const onSubmitAddSintoma = async () => {
      const data = {
        descricao: form.value.descricao,
      };

      const response = await UsecaseAdicionarSintomas.store(data);

      if (response?.success) {
        toast.success("Sintomas adicionado com sucesso", {
          timeout: 3000,
        });

        buscarListaSintomas("");

        modalAddSintoma.value = false;
        form.value.descricao = undefined;
      } else {
        toast.success("Não foi possível adicionar o sintoma", {
          timeout: 3000,
        });
      }
    };

    const onRefreshData = async () => {
      loading.value = true;

      await buscarListaSintomas("");

      loading.value = false;
    };

    onMounted(() => {
      buscarListaSintomas("");
    });

    return {
      form,
      search,
      loading,
      onRefreshData,
      cabecalhoTabela,
      dataListaSintomas,
      modalAddSintoma,
      onSubmitAddSintoma,
    };
  },
});
</script>

<template>
  <div class="container">
    <Title title="SINTOMAS" />

    <div class="container bg-white mt-4">
      <div class="table">
        <v-col align="right">
          <v-btn color="green" class="mr-2" @click="onRefreshData"
            >Atualizar</v-btn
          >
          <v-btn color="blue" @click="modalAddSintoma = true">Adicionar</v-btn>
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
          :items="dataListaSintomas"
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

    <v-dialog v-model="modalAddSintoma" width="35%" persistent>
      <v-card>
        <TitleModal
          title="Adicionar Sintomas"
          @fechar="modalAddSintoma = false"
        />
        <v-card-text>
          <div class="formulario">
            <form class="spacing" @submit.prevent="onSubmitAddSintoma">
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
  </div>
</template>
