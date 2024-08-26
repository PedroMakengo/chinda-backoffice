import { defineStore } from "pinia";
import { ref, onMounted } from "vue";

import { UsecaseListaPedidos } from "@/Domain/Usecases/Medicos/Pedidos/usecase_lista_pedido";

export const storePedidos = defineStore("storePedidos", () => {
  const dataListaPedidosPedentes = ref<any>([]);
  const dataListaPedidosAprovados = ref<any>([]);
  const dataListaPedidosReprovados = ref<any>([]);

  // PEDIDOS APROVADOS
  async function buscarPedidosAprovados() {
    try {
      const query = `?page=1&pageSize=100&estado=2`;
      const response = await UsecaseListaPedidos.handler(query);
      dataListaPedidosAprovados.value = response?.object.items;
    } catch (error) {
      console.error(error);
    }
  }

  onMounted(() => {
    buscarPedidosAprovados();
  });

  return {
    dataListaPedidosPedentes,
    dataListaPedidosAprovados,
    dataListaPedidosReprovados,
    buscarPedidosAprovados,
  };
});
