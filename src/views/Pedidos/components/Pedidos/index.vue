<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { UsecaseListaPedidos } from "@/Domain/Usecases/Medicos/Pedidos/usecase_lista_pedido";
import { UsecaseAprovarPedidosInscricao } from "@/Domain/Usecases/Pedidos/usecase_aprovado_pedidos";

import TitleModal from "@/components/TitleModal/index.vue";
import { UsecaseListaEspecializacoes } from "@/Domain/Usecases/Especializacoes/usecase_lista_especializacoes";
import { useToast } from "vue-toastification";
import { openBase64Pdf } from "@/utils/openBase64Pdf";
import { FormatarData } from "@/utils/formatarData";
import { UsecaseListaPedidosAnexos } from "@/Domain/Usecases/Pedidos/usecase_pedidos_anexos";
import { useStorePedidos } from "@/stores/store_pedidos";

export default defineComponent({
  components: { TitleModal },
  setup() {
    // TOAST
    const toast = useToast();
    // VARIAVEIS
    const loading = ref(false);
    const dataListaMedicos = ref<any>([]);
    const modalDetalhesPedidos = ref(false);

    const cabecalhoTabelaPedidos = ref([
      { key: "itens", title: "#" },
      { key: "processo", title: "Processo" },
      { key: "nome", title: "Nome" },
      { key: "sobrenome", title: "Sobrenome" },
      { key: "telefone", title: "Telefone" },
      { key: "especializacao.descricao", title: "Especialização" },
      { key: "estado", title: "Estado" },
      { key: "accoes", title: "Acções", sortable: false },
    ]);

    const cabecalhoTabela = ref([
      { key: "itens", title: "#" },
      { key: "nome", title: "Nome" },
      { key: "sobrenome", title: "Sobrenome" },
      { key: "email", title: "E-mail" },
      { key: "accoes", title: "Acções", sortable: false },
    ]);

    const search = ref("");
    const tab = ref({ tab: "option-2" });
    const dataListaPedidos = ref<any>([]);
    const modalPedidos = ref(false);
    const loadingTabela = ref(false);

    const loadingRejeitado = ref(false);
    const loadingAceitado = ref(false);
    const loadingProcessamentoArquivos = ref(false);

    const storePedidos = useStorePedidos();

    // DATA RETORNADO DOS PEDIDOS DE INSCRIÇÃO
    const dataListaEspecializacao = ref<any>([]);
    const dataVinculo = ref<any>([]);
    const dataArquivos = ref<any>([]);
    const dataObjecto = ref<any>({
      especializacao: "",
      id: "",
      itens: "",
      nome: "",
      processo: "",
      sobrenome: "",
      telefone: "",
    });

    const forms = ref({});

    // FUNÇÕES
    const buscarListaPedidos = async () => {
      loadingTabela.value = true;
      try {
        const query = `?page=1&pageSize=100&estado=2`;
        const response = await UsecaseListaPedidos.handler(query);
        dataListaPedidos.value = response?.object.items;

        dataListaPedidos.value.forEach((item: any, index: number) => {
          item["itens"] = index + 1;
        });

        loadingTabela.value = false;
      } catch (error) {
        loadingTabela.value = false;
      }
    };

    const buscarListaEspecializacoes = async () => {
      const response = await UsecaseListaEspecializacoes.handler();
      dataListaEspecializacao.value = response?.object.items;
    };

    // Médicos por aprovar
    const onRefreshData = async () => {
      loading.value = true;

      buscarListaPedidos();

      loading.value = false;
    };

    const onSubmitRejeitarPedidoInscricao = async () => {
      loadingRejeitado.value = true;
      const data = [
        {
          operationType: 0,
          path: "estado", // campo
          op: "replace", // tipo de operação (replace)
          from: 2, // valor antigo (ENUM)
          value: 0, // valor novo (ENUM)
        },
      ];

      const response = await UsecaseAprovarPedidosInscricao.store(
        data,
        dataObjecto.value.id
      );

      if (response?.success) {
        toast.success("Pedido de Inscrição Rejeitada verifique o seu e-mail", {
          timeout: 3000,
        });
        loadingRejeitado.value = false;
        modalDetalhesPedidos.value = false;
        buscarListaPedidos();
        storePedidos.buscarPedidosAprovados();
        storePedidos.buscarPedidosPendentes();
        storePedidos.buscarPedidosReprovados();
      } else {
        toast.error(response?.object.detail, {
          timeout: 3000,
        });
        loadingRejeitado.value = false;
      }
    };

    const onSubmitAprovarPedidoInscricao = async () => {
      loadingAceitado.value = true;
      const data = [
        {
          operationType: 0,
          path: "estado", // campo
          op: "replace", // tipo de operação (replace)
          from: 2, // valor antigo (ENUM)
          value: 1, // valor novo (ENUM)
        },
      ];

      const response = await UsecaseAprovarPedidosInscricao.store(
        data,
        dataObjecto.value.id
      );
      console.log(response);

      if (response?.success) {
        toast.success("Pedido de Inscrição Aprovado com Sucesso", {
          timeout: 3000,
        });
        loadingAceitado.value = false;
        modalDetalhesPedidos.value = false;
        buscarListaPedidos();
        storePedidos.buscarPedidosAprovados();
        storePedidos.buscarPedidosPendentes();
        storePedidos.buscarPedidosReprovados();
      } else {
        toast.error(response?.object.detail, {
          timeout: 3000,
        });
        loadingAceitado.value = false;
      }
    };

    const handlerAnexosPedidos = async (processo: string) => {
      loadingProcessamentoArquivos.value = true;

      const response = await UsecaseListaPedidosAnexos.handler(processo);
      dataArquivos.value = response?.object;

      loadingProcessamentoArquivos.value = false;
    };

    const handleDetailsPedidos = (item: any) => {
      dataObjecto.value = {
        especializacao: item.especializacao,
        id: item.id,
        itens: item.itens,
        nome: item.nome,
        processo: item.processo,
        sobrenome: item.sobrenome,
        telefone: item.telefone,
      };

      dataVinculo.value = item.vinculos;
      modalDetalhesPedidos.value = true;
      handlerAnexosPedidos(item.processo);
    };

    const handleOpen = (arquivo: string) => {
      openBase64Pdf(arquivo);
    };

    onMounted(() => {
      buscarListaPedidos();
      buscarListaEspecializacoes();
    });

    return {
      forms,
      tab,
      loading,
      loadingTabela,
      search,
      onRefreshData,
      modalDetalhesPedidos,
      cabecalhoTabela,
      cabecalhoTabelaPedidos,
      dataListaMedicos,
      dataListaPedidos,
      handleDetailsPedidos,
      onSubmitRejeitarPedidoInscricao,
      onSubmitAprovarPedidoInscricao,
      FormatarData,
      loadingRejeitado,
      loadingAceitado,
      loadingProcessamentoArquivos,

      // DATA PEDIDOS
      dataArquivos,
      dataVinculo,
      dataObjecto,
      dataListaEspecializacao,
      handleOpen,
    };
  },
});
</script>

<template>
  <div class="container">
    <div class="container mt-4">
      <div class="table">
        <v-col align="right">
          <v-btn color="green" class="mr-2" @click="onRefreshData"
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
          :headers="cabecalhoTabelaPedidos"
          :search="search"
          :items="dataListaPedidos"
          :loading="loadingTabela"
        >
          <template v-slot:[`item.estado`]="{ item }: any">
            <v-chip label color="orange">{{ item.estado.descricao }}</v-chip>
          </template>

          <template v-slot:[`item.accoes`]="{ item }">
            <v-menu transition="slide-x-transition">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" size="small" v-bind="props">
                </v-btn>
              </template>
              <v-list>
                <v-list-item :value="0" @click="handleDetailsPedidos(item)">
                  <v-list-item-title>Detalhes</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </div>

      <!-- MODAL PEDIDOS -->
      <v-dialog v-model="modalDetalhesPedidos" width="85%" persistent>
        <v-card>
          <TitleModal
            title="Detalhes Pedido de Inscrição"
            @fechar="modalDetalhesPedidos = false"
          />
          <v-card-text>
            <div class="formulario">
              <form class="spacing">
                <v-row>
                  <v-col cols="12" md="12" align="right">
                    <v-btn
                      class="mr-2"
                      @click="onSubmitAprovarPedidoInscricao"
                      color="blue"
                      :loading="loadingAceitado"
                      >Aprovar Pedido</v-btn
                    >
                    <v-btn
                      @click="onSubmitRejeitarPedidoInscricao"
                      color="red"
                      :loading="loadingRejeitado"
                      >Reprovar Pedido
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="pt-4 pb-4">
                  <v-col cols="12" md="4">
                    <v-text-field
                      clearable
                      label="Processo"
                      variant="outlined"
                      v-model="dataObjecto.processo"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      clearable
                      label="Nome"
                      variant="outlined"
                      v-model="dataObjecto.nome"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      clearable
                      label="Sobrenome"
                      variant="outlined"
                      v-model="dataObjecto.sobrenome"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      clearable
                      label="Telefone"
                      variant="outlined"
                      v-model="dataObjecto.telefone"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-autocomplete
                      clearable
                      label="Especialização"
                      variant="outlined"
                      :items="dataListaEspecializacao"
                      v-model="dataObjecto.especializacao"
                      item-title="descricao"
                      item-value="id"
                      readonly
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="mt-4 pt-4">
                  <v-col>
                    <v-divider></v-divider>
                  </v-col>

                  <v-col cols="12" md="12">
                    <h2>Vínculos</h2>
                  </v-col>

                  <!-- LISTAGEM DE TODOS OS VÍNCULOS -->
                  <v-col
                    md="12"
                    cols="6"
                    v-for="(el, index) in dataVinculo"
                    :key="index"
                  >
                    <div class="card">
                      <div class="card-content">
                        <div class="card-image">
                          {{ el.hospital[0] }}
                        </div>
                        <div class="card-descricao">
                          <h4>{{ el.hospital }}</h4>
                          <span class="item-cidade"
                            >{{ el.cidade }} - {{ el.pais }}</span
                          >
                          <h5>
                            {{ FormatarData(el.dataInicio) }} -
                            {{ FormatarData(el.dataFim) }}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <!-- LISTAGEM DE TODOS OS VÍNCULOS -->
                </v-row>

                <v-row class="mt-4 pt-4">
                  <v-col>
                    <v-divider></v-divider>
                  </v-col>
                  <v-col cols="12" md="12">
                    <h2>Arquivos</h2>
                  </v-col>

                  <!-- LISTAGEM DE TODOS OS VÍNCULOS -->

                  <template v-if="loadingProcessamentoArquivos">
                    <v-col cols="12" md="12">
                      <v-skeleton-loader type="paragraph"></v-skeleton-loader>
                    </v-col>
                  </template>

                  <div v-else>
                    <v-col cols="12" md="12" class="mt-2 mb-2">
                      <div v-if="dataArquivos.length > 0">
                        <template
                          v-for="(el, index) in dataArquivos"
                          :key="index"
                        >
                          <v-chip
                            color="green"
                            class="mr-2 mb-2"
                            label
                            @click="handleOpen(el.content)"
                          >
                            {{ el.nome }}
                          </v-chip>
                        </template>
                      </div>

                      <div v-else>
                        <p>Não existe nenhum arquivo</p>
                      </div>
                    </v-col>
                  </div>
                  <!-- LISTAGEM DE TODOS OS VÍNCULOS -->
                </v-row>
              </form>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- MODAL PEDIDOS -->
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

.card {
  margin-top: 1.5rem;

  .card-content {
    display: flex;
    gap: 1rem;

    .card-image {
      width: 80px;
      height: 80px;

      background: #2e8ceb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;

      font-weight: bold;

      border-radius: 0.1rem;
      color: #fff;
    }
    span {
      color: #8b8b8b;
    }
    h5 {
      font-size: 1rem;
      text-transform: lowercase;
      color: #8b8b8b;
      font-weight: 300;
    }
  }
}
</style>
