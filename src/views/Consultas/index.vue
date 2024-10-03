<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Title from "@/components/Title/index.vue";
import TitleModal from "@/components/TitleModal/index.vue";
import { UsecaseListaUtente } from "@/Domain/Usecases/Utentes/usecase_lista_utentes";
import { UsecaseListaMedicos } from "@/Domain/Usecases/Medicos/usecase_lista_medicos";
import { UsecaseListaMarcacoes } from "@/Domain/Usecases/Marcacoes/usecase_lista_marcacoes";
import { UsecaseListaMarcacoesPorId } from "@/Domain/Usecases/Marcacoes/usecase_lista_marcacao_por_id";
import { FormatarPreco } from "@/utils/formatarPreco";
import { authStore } from "@/stores/store_autenticacao";

import {
  FormatarDataEditavel,
  FormatarHoraEditavel,
} from "@/utils/formatarDataEditavel";


export default defineComponent({
  components: { Title, TitleModal },
  setup() {
    const forms = ref({
      medicos: undefined,
      utentes: undefined,
      estado: undefined,
    });

    
    const cabecalhoTabela = ref([
      { key: "itens", title: "#" },
      { key: "medico.nomeSobrenome", title: "Médico" },
      { key: "utente.nomeSobrenome", title: "Utente" },
      { key: "dataInicio", title: "Data Início" },
      { key: "horaInicio", title: "Hora Início" },
      { key: "dataFim", title: "Data Fim " },
      { key: "horaFim", title: "Hora Fim" },
      { key: "precoFormatado", title: "Preço Consulta" },
      { key: "estado", title: "Estado" },
      { key: "accoes", title: "Acções", sortable: false },
    ]);

    const dataListaUtentes = ref<any>([]);
    const dataListaMedicos = ref<any>([]);
    const dataListaEstado = ref<any>([]);
    const dataListaMarcacoes = ref<any>([]);
    const search = ref("");
    const loading = ref(false);
    const modalDetalhesConsultas = ref(false);
    const dataObjecto = ref<any>({});
    const medico = ref<any>({});
    const endereco = ref<any>({});
    const provincia = ref<any>("");
    const utente = ref({
      nome: "",
      sobrenome: "",
      telefone: "",
    });

    const enderecoHorario = ref({
      dataInicio: "",
      horaInicio: "",
      dataMarcacao: "",
      horaMarcacao:"",
      dataFim: "",
      horaFim: "",
      provincia: "",
      cidade: "",
      endereco1: "",
      endereco2: "",
    });
    const dataEstados = ref([
      { id: 1, nome: "CANC" },
      { id: 2, nome: "PEND" },
      { id: 3, nome: "APR" },
      { id: 4, nome: "REAL" },
      { id: 5, nome: "CUR" },
    ]);
    const onRefreshDataMarcacoes = () => {};
    const onRemoveFilter = () => {
      forms.value.medicos = undefined;
      forms.value.estado = undefined;
      forms.value.utentes = undefined;
      search.value = "";
      buscarListaMarcacoes();
    };

    // Pegando o Utilizador Logado
    const perfil = ref("");
    const medicoId = ref("");

    const retornarUtilizador = async () => {
      let responseLocalStorage: any = await authStore.getUser();

      medicoId.value = responseLocalStorage.medico.id;
      perfil.value = responseLocalStorage.perfis[0];
    };

    const handlerDetalhesMarcacao = (marcacao: any) => {
      modalDetalhesConsultas.value = true;

      buscarMarcacoesPorId(marcacao.id);
    };

    const buscarMarcacoesPorId = async (id: string) => {
      const response = await UsecaseListaMarcacoesPorId.handler(id);
      dataObjecto.value = response?.object;

      medico.value = dataObjecto.value?.medico;
      endereco.value = dataObjecto.value?.endereco;
      provincia.value = endereco.value.provincia.nome;
      utente.value = dataObjecto.value?.utente;
      enderecoHorario.value = {
        dataMarcacao:dataObjecto.value?.horaProvavelInicio ? FormatarDataEditavel(dataObjecto.value?.horaProvavelInicio) : "",
        horaMarcacao:dataObjecto.value?.horaProvavelInicio ? FormatarHoraEditavel(dataObjecto.value?.horaProvavelInicio) : "",
        dataInicio: dataObjecto.value?.horaInicio ? FormatarDataEditavel(dataObjecto.value?.horaInicio): "",
        horaInicio: dataObjecto.value?.horaInicio ? FormatarHoraEditavel(dataObjecto.value?.horaInicio): "",
        dataFim: dataObjecto.value?.horaFimReal ?? "",
        horaFim: dataObjecto.value?.horaFimReal ? FormatarHoraEditavel(dataObjecto.value?.horaInicio): "",
        provincia: dataObjecto.value?.endereco.provincia.nome,
        cidade: dataObjecto.value?.cidade,
        endereco1: dataObjecto.value?.endereco1,
        endereco2: dataObjecto.value?.endereco2,
      };
    };

    const buscarMarcacoesPorFiltro = async () => {
      loading.value = true;

      let query = "";
      const perfilMedico = perfil.value === "Medico"; // Verifica se o perfil é de médico
      const medicoIdLogado = perfilMedico
        ? medicoId.value
        : forms.value.medicos; // Usa o ID do médico conforme o perfil

      // Verifica se todos os campos estão definidos
      if (
        forms.value.utentes !== undefined &&
        forms.value.estado !== undefined
      ) {
        query += `?utenteId=${forms.value.utentes}&estado=${forms.value.estado}&medicoId=${medicoIdLogado}`;
      } else {
        // Verifica se 'utentes' está definido
        if (forms.value.utentes !== undefined) {
          query += `?utenteId=${forms.value.utentes}&medicoId=${medicoIdLogado}`;
        }
        // Verifica se 'estado' está definido
        else if (forms.value.estado !== undefined) {
          query += `?estado=${forms.value.estado}&medicoId=${medicoIdLogado}`;
        }
        // Caso nenhum dos filtros esteja definido, passa apenas o medicoId
        else {
          query += `?medicoId=${medicoIdLogado}`;
        }
      }

      const response = await UsecaseListaMarcacoes.handler(query);
      dataListaMarcacoes.value = response.object.items;

      retornaMarcacoesFormatados();

      loading.value = false;
    };

    const retornaMarcacoesFormatados = () => {
      dataListaMarcacoes.value.forEach((el: any, index: number) => {
        el["itens"] = index + 1;
        el["medico.nomeSobrenome"] = `${el.medico.nome} ${el.medico.sobrenome}`;
        el["utente.nomeSobrenome"] = `${el.utente.nome} ${el.utente.sobrenome}`;
        el["precoFormatado"] = FormatarPreco(el.precoConsulta);
        el["dataFim"] = el["horaFimReal"] ? FormatarDataEditavel(el["horaFimReal"]) : "";
        el["horaFim"] = el["horaFimReal"] ? FormatarHoraEditavel(el["horaFimReal"]) : "";
        el["dataInicio"] = el["horalInicio"] ? FormatarDataEditavel(el["horalInicio"]) : "";
        el["horaInicio"] = el["horalInicio"] ? FormatarHoraEditavel(el["horalInicio"]) : "";
        el["estado"] = el.estado.id;
      });
    };

    const buscarListaMarcacoes = async () => {
      loading.value = true;
      let query = `?pageNumber=1&pageSize=1000`;

      console.log(perfil.value);
      if (perfil.value !== "Medico") {
        const response = await UsecaseListaMarcacoes.handler(query);
        dataListaMarcacoes.value = response.object.items;
        retornaMarcacoesFormatados();
      } else {
        query += `&medicoId=${medicoId.value}`;
        const response = await UsecaseListaMarcacoes.handler(query);
        dataListaMarcacoes.value = response.object.items;
        retornaMarcacoesFormatados();

        console.log("Bateu aqui...");
      }
      loading.value = false;
    };

    // BUSCAR DADOS DOS CAMPOS DE FILTROS
    const buscarListaUtentes = async () => {
      const query = `?pageNumber=1&pageSize=100`;
      const response = await UsecaseListaUtente.handler(query);
      dataListaUtentes.value = response.object.items;

      dataListaUtentes.value.forEach((el: any) => {
        el["nomeSobrenome"] = `${el.nome} ${el.sobrenome}`;
      });
    };

    const buscarListaMedicos = async () => {
      const query = `?pageNumber=1&pageSize=100`;
      const response = await UsecaseListaMedicos.handler(query);
      dataListaMedicos.value = response.object.items;

      dataListaMedicos.value.forEach((el: any) => {
        el["nomeSobrenome"] = `${el.nome} ${el.sobrenome}`;
      });
    };

    onMounted(async () => {
      await retornarUtilizador();
      buscarListaUtentes();
      buscarListaMedicos();
      buscarListaMarcacoes();
    });

    return {
      forms,
      loading,
      search,
      onRefreshDataMarcacoes,
      dataListaMedicos,
      dataListaEstado,
      dataListaUtentes,
      onRemoveFilter,
      handlerDetalhesMarcacao,
      cabecalhoTabela,
      dataListaMarcacoes,
      modalDetalhesConsultas,
      dataObjecto,
      medico,
      endereco,
      provincia,
      utente,
      enderecoHorario,
      dataEstados,
      buscarMarcacoesPorFiltro,
      perfil,
    };
  },
});
</script>

<template>
  <div class="container">
    <Title title="CONSULTAS" />

    <div class="container mt-4">
      <div class="bg-white">
        <v-col align="right">
          <v-btn color="green" @click="onRefreshDataMarcacoes">Atualizar</v-btn>
        </v-col>

        <v-card-title>
          <form>
            <v-row class="mt-4">
              <v-col cols="12" md="3">
                <v-autocomplete
                  label="Utentes"
                  :items="dataListaUtentes"
                  item-value="id"
                  item-title="nomeSobrenome"
                  v-model="forms.utentes"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3" v-if="perfil !== 'Medico'">
                <v-autocomplete
                  label="Medicos"
                  :items="dataListaMedicos"
                  item-value="id"
                  item-title="nomeSobrenome"
                  v-model="forms.medicos"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  label="Estado"
                  :items="dataEstados"
                  item-value="id"
                  item-title="nome"
                  v-model="forms.estado"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3" class="buttons-pesquisa">
                <v-btn
                  color="blue"
                  class="mr-2"
                  @click="buscarMarcacoesPorFiltro"
                  >Pesquisar</v-btn
                >
                <v-btn color="orange" class="text-white" @click="onRemoveFilter"
                  >Limpar Filtro</v-btn
                >
              </v-col>
            </v-row>
          </form>

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
          :items="dataListaMarcacoes"
          :loading="loading"
        >
          <template v-slot:[`item.estado`]="{ item }: any">
            <v-chip label color="red" v-if="item.estado === 1"
              >Cancelado</v-chip
            >
            <v-chip label color="yellow" v-else-if="item.estado === 2"
              >Pendente</v-chip
            >
            <v-chip label color="blue" v-else-if="item.estado === 3"
              >Aprovado</v-chip
            >
            <v-chip label color="red" v-else-if="item.estado === 4"
              >REAL</v-chip
            >
            <v-chip label color="orange" v-else-if="item.estado === 5"
              >Curso</v-chip
            >
          </template>

          <template v-slot:[`item.accoes`]="{ item }">
            <v-menu transition="slide-x-transition">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" size="small" v-bind="props">
                </v-btn>
              </template>
              <v-list>
                <v-list-item :value="1" @click="handlerDetalhesMarcacao(item)">
                  <v-list-item-title>Detalhes </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- MODAL -->
    <v-dialog v-model="modalDetalhesConsultas" width="85%" persistent>
      <v-card>
        <TitleModal
          title="Detalhes de Consulta"
          @fechar="modalDetalhesConsultas = false"
        />
        <v-card-text>
          <div class="formulario">
            <form class="spacing">
              <v-row class="pt-4 pb-4">
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Nome"
                    variant="outlined"
                    v-model="medico.nome"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Sobrenome"
                    variant="outlined"
                    v-model="medico.sobrenome"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Telefone"
                    variant="outlined"
                    v-model="medico.telefone"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Preço"
                    variant="outlined"
                    v-model="medico.precoConsulta"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-2 pt-2">
                <v-col cols="12" md="12">
                  <h2>UTENTES</h2>
                </v-col>
                <v-col cols="12" md="12" class="mb-2">
                  <v-divider></v-divider>
                </v-col>
              </v-row>

              <v-row class="mt-5 pt-5">
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Nome"
                    variant="outlined"
                    v-model="utente.nome"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Sobrenome"
                    variant="outlined"
                    v-model="utente.sobrenome"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Telefone"
                    variant="outlined"
                    v-model="utente.telefone"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-2 pt-2">
                <v-col cols="12" md="12">
                  <h2>HORÁRIO</h2>
                </v-col>

                <v-col cols="12" md="12" class="mb-2">
                  <v-divider></v-divider>
                </v-col>
              </v-row>

              <v-row class="mt-5 pt-5">
                <v-col cols="12" md="2">
                  <v-text-field
                    label="Data Provável Início"
                    variant="outlined"
                    v-model="enderecoHorario.dataMarcacao"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    label="Hora Provável Início"
                    variant="outlined"
                    v-model="enderecoHorario.horaMarcacao"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    label="Data Início"
                    variant="outlined"
                    v-model="enderecoHorario.dataInicio"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    label="Hora Início"
                    variant="outlined"
                    v-model="enderecoHorario.horaInicio"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    label="Data Fim"
                    variant="outlined"
                    v-model="enderecoHorario.dataFim"
                    readonly
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="2">
                  <v-text-field
                    label="Hora Fim"
                    variant="outlined"
                    v-model="enderecoHorario.dataFim"
                    readonly
                  ></v-text-field>
                </v-col>

              </v-row>
              
              <v-row class="mt-2 pt-2">
                <v-col cols="12" md="12">
                  <h2>ENDEREÇO</h2>
                </v-col>
                <v-col cols="12" md="12" class="mb-2">
                  <v-divider></v-divider>
                </v-col>
              </v-row>

              <v-row class="mt-5 pt-5">
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Provincia"
                    variant="outlined"
                    v-model="enderecoHorario.provincia"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    label="Cidade"
                    variant="outlined"
                    v-model="enderecoHorario.cidade"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    label="Endereço 1"
                    variant="outlined"
                    v-model="enderecoHorario.endereco1"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    label="Endereço 2"
                    variant="outlined"
                    v-model="enderecoHorario.endereco2"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
            </form>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- END MODAL -->
  </div>
</template>

<style lang="scss" scoped>
.buttons-pesquisa {
  margin-bottom: 2rem;
}
</style>
