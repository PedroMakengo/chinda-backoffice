<script lang="ts">
import { defineComponent, ref } from "vue";
import Title from "@/components/Title/index.vue";
import { UsecaseAdicionarDisponibilidade } from "@/Domain/Usecases/Disponibilidade/usecase_adicionar_disponibilidade";
import TitleModal from "@/components/TitleModal/index.vue";

export default defineComponent({
  components: { Title, TitleModal },
  setup() {
    const modalAddDisponibilidade = ref(false);
    const loading = ref(false);
    const search = ref("");
    const cabecalhoTabela = ref([
      { key: "itens", title: "#" },
      { key: "medico", title: "Médico" },
      { key: "diaSemana", title: "Dia de Semanas" },
      { key: "horaInicio", title: "Hora Início" },
      { key: "horaFim", title: "Hora Fim" },
      { key: "accoes", title: "Acções", sortable: false },
    ]);
    const form = ref({
      medicoId: undefined,
      diaSemana: undefined,
      horaInicio: undefined,
      horaFim: undefined,
    });

    const diasDaSemana = [
      { id: 1, dia: "Domingo" },
      { id: 2, dia: "Segunda-feira" },
      { id: 3, dia: "Terça-feira" },
      { id: 4, dia: "Quarta-feira" },
      { id: 5, dia: "Quinta-feira" },
      { id: 6, dia: "Sexta-feira" },
      { id: 7, dia: "Sábado" },
    ];

    // FUNÇÕES
    const onRefreshDataDisponibilidade = () => {};
    const handlerDetalhesDisponibilidade = (el: any) => {};

    const onSubmitAddDisponibilidade = async () => {
      const data = {
        disponibildiade: [],
      };

      const response = await UsecaseAdicionarDisponibilidade.store(data);
    };

    return {
      search,
      loading,
      cabecalhoTabela,
      onRefreshDataDisponibilidade,
      handlerDetalhesDisponibilidade,
      modalAddDisponibilidade,
      onSubmitAddDisponibilidade,
      form,
      diasDaSemana,
    };
  },
});
</script>

<template>
  <div class="container">
    <Title title="DISPONIBILIDADE" />

    <div class="container mt-4">
      <div class="bg-white">
        <v-col align="right">
          <v-btn
            color="green"
            class="mr-2"
            @click="onRefreshDataDisponibilidade"
            >Atualizar</v-btn
          >
          <v-btn color="blue" @click="modalAddDisponibilidade = true"
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
          :items="[]"
          :loading="loading"
        >
          <template v-slot:[`item.accoes`]="{ item }">
            <v-menu transition="slide-x-transition">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" size="small" v-bind="props">
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  :value="1"
                  @click="handlerDetalhesDisponibilidade(item)"
                >
                  <v-list-item-title>Detalhes </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </div>
    </div>

    <v-dialog v-model="modalAddDisponibilidade" width="55%" persistent>
      <v-card>
        <TitleModal
          title="Adicionar Disponibilidade"
          @fechar="modalAddDisponibilidade = false"
        />
        <v-card-text>
          <div class="formulario">
            <form class="spacing" @submit.prevent="onSubmitAddDisponibilidade">
              <v-row class="pt-4 pb-4">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="form.medicoId"
                    clearable
                    label="Médico"
                    variant="outlined"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="form.diaSemana"
                    clearable
                    :items="diasDaSemana"
                    item-value="id"
                    item-title="dia"
                    label="Dia de Semana"
                    variant="outlined"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.horaInicio"
                    type="date"
                    clearable
                    label="Hora Início"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    type="date"
                    v-model="form.horaFim"
                    clearable
                    label="Hora Fim"
                    variant="outlined"
                  ></v-text-field>
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
