<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    // VARIAVIES
    const loading = ref(false);
    const search = ref("");
    const cabecalhoTabela = ref<any>([{}]);

    // FUNCÇÕES
    const onRefreshDataAprrovad = () => {};

    return {
      search,
      loading,
      cabecalhoTabela,
      onRefreshDataAprrovad,
    };
  },
});
</script>

<template>
  <div class="table">
    <v-col align="right">
      <v-btn color="green" class="mr-2" @click="onRefreshDataAprrovad"
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
            <v-list-item :value="1">
              <v-list-item-title>Detalhes</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </div>
</template>
