import { defineStore } from "pinia";
import { ref, onMounted } from "vue";

import { UsecaseListaPedidos } from "@/Domain/Usecases/Medicos/Pedidos/usecase_lista_pedido";

export const useStorePedidos = defineStore("storePedidos", () => {
  const dataListaPedidosPedentes = ref<any>([]);
  const dataListaPedidosAprovados = ref<any>([]);
  const dataListaPedidosReprovados = ref<any>([]);

  // PEDIDOS APROVADOS
  async function buscarPedidosAprovados() {
    try {
      const query = `?page=1&pageSize=100&estado=1`;
      const response = await UsecaseListaPedidos.handler(query);
      dataListaPedidosAprovados.value = response?.object.items;
    } catch (error) {
      console.error(error);
    }
  }

  async function buscarPedidosPendentes() {
    try {
      const query = `?page=1&pageSize=100&estado=2`;
      const response = await UsecaseListaPedidos.handler(query);
      dataListaPedidosPedentes.value = response?.object.items;
    } catch (error) {
      console.error(error);
    }
  }

  async function buscarPedidosReprovados() {
    try {
      const query = `?page=1&pageSize=100&estado=0`;
      const response = await UsecaseListaPedidos.handler(query);
      dataListaPedidosReprovados.value = response?.object.items;
    } catch (error) {
      console.error(error);
    }
  }

  onMounted(() => {
    buscarPedidosAprovados();
    buscarPedidosPendentes();
    buscarPedidosReprovados();
  });

  return {
    dataListaPedidosPedentes,
    dataListaPedidosAprovados,
    dataListaPedidosReprovados,
    buscarPedidosAprovados,
    buscarPedidosPendentes,
    buscarPedidosReprovados,
  };
});
