<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Title from "@/components/Title/index.vue";
import { UsecaseListaUtente } from "@/Domain/Usecases/Utentes/usecase_lista_utentes";
import { UsecaseAdicionarUtente } from "@/Domain/Usecases/Utentes/usecase_adicionar_utentes";
import TitleModal from "@/components/TitleModal/index.vue";

import { useToast } from "vue-toastification";

export default defineComponent({
  components: { Title, TitleModal },
  setup() {
    // VARIAVEIS
    const toast = useToast();
    const loading = ref(false);
    const modalAddUtente = ref(false);
    const dataListaUtente = ref<any>([]);
    const cabecalhoTabela = ref([
      { key: "itens", title: "#" },
      { key: "nome", title: "Nome" },
      { key: "sobrenome", title: "Sobrenome" },
      { key: "telefone", title: "Nº de Telefone" },
      { key: "endereco.provincia.nome", title: "Província" },
      { key: "endereco.cidade", title: "Cidade" },
      { key: "accoes", title: "Acções", sortable: false },
    ]);
    const search = ref("");

    const form = ref<any>({
      nome: undefined!,
      sobrenome: undefined!,
      telefone: undefined!,
      email: undefined!,
      palavraPasse: undefined!,
      confirmarPalavraPasse: undefined!,
    });

    // FUNÇÕES
    const buscarListaUtentes = async (query?: string) => {
      const response = await UsecaseListaUtente.handler(query);
      const data = response?.object;
      dataListaUtente.value = data.items;

      dataListaUtente.value.forEach((item: any, index: number) => {
        item["itens"] = index + 1;
        item["nome"] = item["nome"] === null ? "--" : item["nome"];
        item["sobrenome"] =
          item["sobrenome"] === null ? "--" : item["sobrenome"];
      });

      console.log(dataListaUtente);
    };

    const onSubmitAddUtentes = async () => {
      const data = {
        nome: form.value.nome,
        sobrenome: form.value.sobrenome,
        telefone: form.value.telefone,
        email: form.value.email,
        palavraPasse: form.value.palavraPasse,
        confirmarPalavraPasse: form.value.confirmarPalavraPasse,
      };

      console.log(data);
      const response = await UsecaseAdicionarUtente.store(data);

      if (response?.success) {
        toast.success("Utente adicionado com sucesso", {
          timeout: 3000,
        });

        buscarListaUtentes("");
        form.value.nome = undefined;
        form.value.sobrenome = undefined;
        form.value.telefone = undefined;
        form.value.email = undefined;
        form.value.palavraPasse = undefined;
        form.value.confirmarPalavraPasse = undefined;
        modalAddUtente.value = false;
      } else {
        toast.error("Nâo foi possível efetuar está operação!", {
          timeout: 3000,
        });
      }
    };

    const onRefreshData = async () => {
      loading.value = true;

      await buscarListaUtentes("");

      loading.value = false;
    };

    onMounted(() => {
      buscarListaUtentes("");
    });

    return {
      form,
      search,
      loading,
      onRefreshData,
      cabecalhoTabela,
      dataListaUtente,
      onSubmitAddUtentes,
      modalAddUtente,
    };
  },
});
</script>

<template>
  <div class="container">
    <Title title="UTENTES" />

    <div class="container bg-white mt-4">
      <div class="table">
        <v-col align="right">
          <v-btn color="green" class="mr-2" @click="onRefreshData"
            >Atualizar</v-btn
          >
          <v-btn color="blue" @click="modalAddUtente = true">Adicionar</v-btn>
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
          :items="dataListaUtente"
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

    <v-dialog v-model="modalAddUtente" width="65%" persistent>
      <v-card>
        <TitleModal
          title="Adicionar Utentes"
          @fechar="modalAddUtente = false"
        />
        <v-card-text>
          <div class="formulario">
            <form class="spacing" @submit.prevent="onSubmitAddUtentes">
              <v-row class="pt-4 pb-4">
                <v-col cols="12" md="6">
                  <v-text-field label="Nome" v-model="form.nome"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Sobrenome"
                    v-model="form.sobrenome"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Telefone"
                    v-model="form.telefone"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="E-mail"
                    v-model="form.email"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Palavra-passe"
                    v-model="form.palavraPasse"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Confirmar Palavra-Passe"
                    v-model="form.confirmarPalavraPasse"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
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
