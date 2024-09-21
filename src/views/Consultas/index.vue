<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Title from "@/components/Title/index.vue";
import TitleModal from "@/components/TitleModal/index.vue";
import { UsecaseListaUtente } from "@/Domain/Usecases/Utentes/usecase_lista_utentes";
import { UsecaseListaMedicos } from "@/Domain/Usecases/Medicos/usecase_lista_medicos";
import { UsecaseListaMarcacoes } from "@/Domain/Usecases/Marcacoes/usecase_lista_marcacoes";
import { UsecaseListaMarcacoesPorId } from "@/Domain/Usecases/Marcacoes/usecase_lista_marcacao_por_id";
import { FormatarPreco } from "@/utils/formatarPreco";

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
      { key: "dataMarcacao", title: "Data Início" },
      { key: "horaMarcacao", title: "Hora Início" },
      { key: "dataFim", title: "Hora Marcação Final" },
      { key: "horaFim", title: "Hora Marcação Final" },
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
      dataFim: "",
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
        dataInicio: dataObjecto.value?.horaProvavelInicio,
        dataFim: dataObjecto.value?.horaFimReal,
        provincia: dataObjecto.value?.endereco.provincia.nome,
        cidade: dataObjecto.value?.cidade,
        endereco1: dataObjecto.value?.endereco1,
        endereco2: dataObjecto.value?.endereco2,
      };
    };

    const buscarMarcacoesPorFiltro = async () => {
      loading.value = true;

      let query = "";

      // Verifica se todos os campos estão definidos
      if (
        forms.value.medicos !== undefined &&
        forms.value.estado !== undefined &&
        forms.value.utentes !== undefined
      ) {
        query += `?utenteId=${forms.value.utentes}&estado=${forms.value.estado}&medicoId=${forms.value.medicos}`;
      } else {
        // Verifica se 'medicos' e 'utentes' estão definidos
        if (
          forms.value.medicos !== undefined &&
          forms.value.utentes !== undefined
        ) {
          query += `?utenteId=${forms.value.utentes}&medicoId=${forms.value.medicos}`;
        }
        // Verifica se 'medicos' e 'estado' estão definidos
        else if (
          forms.value.medicos !== undefined &&
          forms.value.estado !== undefined
        ) {
          query += `?estado=${forms.value.estado}&medicoId=${forms.value.medicos}`;
        }
        // Verifica se 'utentes' e 'estado' estão definidos
        else if (
          forms.value.utentes !== undefined &&
          forms.value.estado !== undefined
        ) {
          query += `?utenteId=${forms.value.utentes}&estado=${forms.value.estado}`;
        }
        // Verifica se apenas 'medicos' está definido
        else if (forms.value.medicos !== undefined) {
          query += `?medicoId=${forms.value.medicos}`;
        }
        // Verifica se apenas 'estado' está definido
        else if (forms.value.estado !== undefined) {
          query += `?estado=${forms.value.estado}`;
        }
        // Verifica se apenas 'utentes' está definido
        else if (forms.value.utentes !== undefined) {
          query += `?utenteId=${forms.value.utentes}`;
        }
      }

      const response = await UsecaseListaMarcacoes.handler(query);
      dataListaMarcacoes.value = response.object.items;

      loading.value = false;
    };

    const buscarListaMarcacoes = async () => {
      loading.value = true;
      const query = `?pageNumber=1&pageSize=1000`;
      const response = await UsecaseListaMarcacoes.handler(query);
      dataListaMarcacoes.value = response.object.items;

      dataListaMarcacoes.value.forEach((el: any, index: number) => {
        el["itens"] = index + 1;
        el["medico.nomeSobrenome"] = `${el.medico.nome} ${el.medico.sobrenome}`;
        el["utente.nomeSobrenome"] = `${el.utente.nome} ${el.utente.sobrenome}`;
        el["precoFormatado"] = FormatarPreco(el.precoConsulta);
        el["dataMarcacao"] = FormatarDataEditavel(el["horaProvavelInicio"]);
        el["horaMarcacao"] = FormatarHoraEditavel(el["horaProvavelInicio"]);
        el["dataFim"] = FormatarDataEditavel(el["horaFimReal"]);
        el["horaFim"] = FormatarHoraEditavel(el["horaFimReal"]);
        el["estado"] = el.estado.id;
      });
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

    onMounted(() => {
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
              <v-col cols="12" md="3">
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
              <v-col cols="12" md="3">
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
          <template v-slot:[`item.estado`]="{ item }">
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
                    clearable
                    label="Nome"
                    variant="outlined"
                    v-model="medico.nome"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    clearable
                    label="Sobrenome"
                    variant="outlined"
                    v-model="medico.sobrenome"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    clearable
                    label="Telefone"
                    variant="outlined"
                    v-model="medico.telefone"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    clearable
                    label="Preço"
                    variant="outlined"
                    v-model="medico.precoConsulta"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-2 pt-2">
                <v-col>
                  <v-divider></v-divider>
                </v-col>

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
                    clearable
                    label="Nome"
                    variant="outlined"
                    v-model="utente.nome"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    clearable
                    label="Sobrenome"
                    variant="outlined"
                    v-model="utente.sobrenome"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    clearable
                    label="Telefone"
                    variant="outlined"
                    v-model="utente.telefone"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-2 pt-2">
                <v-col>
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="12" md="12">
                  <h2>HORÁRIOS & ENDEREÇO</h2>
                </v-col>

                <v-col cols="12" md="12" class="mb-2">
                  <v-divider></v-divider>
                </v-col>
              </v-row>

              <v-row class="mt-5 pt-5">
                <v-col cols="12" md="3">
                  <v-text-field
                    clearable
                    label="Data Início"
                    variant="outlined"
                    v-model="enderecoHorario.dataInicio"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    clearable
                    label="Data Fim"
                    variant="outlined"
                    v-model="enderecoHorario.dataFim"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="3">
                  <v-text-field
                    clearable
                    label="Provincia"
                    variant="outlined"
                    v-model="enderecoHorario.provincia"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    clearable
                    label="Cidade"
                    variant="outlined"
                    v-model="enderecoHorario.cidade"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    clearable
                    label="Endereço 1"
                    variant="outlined"
                    v-model="enderecoHorario.endereco1"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    clearable
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
