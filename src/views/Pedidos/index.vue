<script lang="ts">
import { defineComponent, ref, computed } from "vue";

import Title from "@/components/Title/index.vue";

import Pedidos from "./components/Pedidos/index.vue";
import MedicosAprovados from "./components/Aprovados/index.vue";
import MedicosReprovados from "./components/Reprovados/index.vue";
import { useStorePedidos } from "@/stores/store_pedidos";

export default defineComponent({
  components: { Title, Pedidos, MedicosAprovados, MedicosReprovados },
  setup() {
    // VARIAVEIS
    const tab = ref({ tab: "option-2" });
    const storePedidos = useStorePedidos();

    const totalPedidosAprovados = computed(() => {
      const total = storePedidos.dataListaPedidosAprovados.length;
      return total > 0 ? `(${total})` : "";
    });

    const totalPedidosReprovados = computed(() => {
      const total = storePedidos.dataListaPedidosReprovados.length;
      return total > 0 ? `(${total})` : "";
    });

    const totalPedidosPendentes = computed(() => {
      const total = storePedidos.dataListaPedidosPedentes.length;
      return total > 0 ? `(${total})` : "";
    });

    return {
      tab,
      totalPedidosAprovados,
      totalPedidosReprovados,
      totalPedidosPendentes,
    };
  },
});
</script>

<template>
  <div class="container">
    <Title title="PEDIDOS DE INSCRIÇÕES" />

    <div class="container mt-4">
      <div class="bg-white">
        <v-tabs
          v-model="tab"
          direction="horizontal"
          color="primary"
          align-tabs="start"
          class="tab"
        >
          <v-tab value="option-1"
            >Pedido de Inscrição Pendentes {{ totalPedidosPendentes }}</v-tab
          >
          <v-tab value="option-2"
            >Pedido de Inscrição Reprovados {{ totalPedidosReprovados }}</v-tab
          >
          <v-tab value="option-3"
            >Pedido de Inscrição Aprovados {{ totalPedidosAprovados }}</v-tab
          >
          <!-- <v-tab value="option-3">Médicos</v-tab> -->
        </v-tabs>
      </div>
      <v-window v-model="tab" class="mt-4">
        <v-window-item value="option-1">
          <v-card flat>
            <Pedidos />
          </v-card>
        </v-window-item>

        <v-window-item value="option-2">
          <v-card flat>
            <MedicosReprovados />
          </v-card>
        </v-window-item>

        <v-window-item value="option-3">
          <v-card flat>
            <MedicosAprovados />
          </v-card>
        </v-window-item>
      </v-window>
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
