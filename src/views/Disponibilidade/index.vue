<script lang="ts">
import { defineComponent, ref } from "vue";
import Title from "@/components/Title/index.vue";

export default defineComponent({
  components: { Title },
  setup() {
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

    // FUNÇÕES
    const onRefreshDataDisponibilidade = () => {};
    const handlerDetalhesDisponibilidade = (el: any) => {};

    return {
      search,
      loading,
      cabecalhoTabela,
      onRefreshDataDisponibilidade,
      handlerDetalhesDisponibilidade,
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
          <v-btn color="green" @click="onRefreshDataDisponibilidade"
            >Atualizar</v-btn
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
  </div>
</template>
