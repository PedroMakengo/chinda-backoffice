<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Title from "@/components/Title/index.vue";
import { UsecaseAdicionarDisponibilidade } from "@/Domain/Usecases/Disponibilidade/usecase_adicionar_disponibilidade";
import { UsecaseObterListaDisponibilidade } from "@/Domain/Usecases/Disponibilidade/usecase_lista_disponibilidade";

import TitleModal from "@/components/TitleModal/index.vue";
import { authStore } from "@/stores/store_autenticacao";
import { useToast } from "vue-toastification";
import { FormatarHoraEditavel } from "../../utils/formatarDataEditavel";

export default defineComponent({
  components: { Title, TitleModal },
  setup() {
    const toast = useToast();
    const modalAddDisponibilidade = ref(false);
    const loading = ref(false);
    const search = ref("");

    const cabecalhoTabela = ref([
      { key: "itens", title: "#" },
      { key: "diaSemana", title: "Dia de Semanas" },
      { key: "horaInicio", title: "Hora Início" },
      { key: "horaFim", title: "Hora Fim" },
      { key: "accoes", title: "Acções", sortable: false },
    ]);

    const form = ref<any>({
      medicoId: undefined,
      diaSemana: undefined,
      horaInicio: undefined,
      horaFim: undefined,
      nomeMedico: undefined as any,
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

    const dataListaDisponibilidade = ref<any>([]);
    const dataDisponibilidade = ref<any>([]);
    const dataPreviewDisponibilidade = ref<any>([]);

    // FUNÇÕES
    const retornarUtilizador = async () => {
      let response: any = await authStore.getUser();

      form.value.medicoId = response.medico.id;
      form.value.nomeMedico = response.userName;
    };

    const onRefreshDataDisponibilidade = () => {};
    const handlerDetalhesDisponibilidade = (el: any) => {};

    const onSubmitAddDisponibilidade = async () => {
      const data = {
        disponibilidade: dataDisponibilidade.value,
      };

      const response = await UsecaseAdicionarDisponibilidade.store(data);

      if (response?.success) {
        toast.success("Disponibilidade adicionado com Sucesso", {
          timeout: 3000,
        });
        modalAddDisponibilidade.value = false;
        dataDisponibilidade.value = [];
        dataPreviewDisponibilidade.value = [];

        buscarListaDisponibilidade(form.value.medicoId);
      } else {
        toast.error("Ocorreu um erro ao tentar submeter o pedido", {
          timeout: 3000,
        });
      }
    };

    const buscarListaDisponibilidade = async (medico: string) => {
      const response = await UsecaseObterListaDisponibilidade.handler(medico);
      dataListaDisponibilidade.value = response?.object;

      const diasDaSemana: Record<number, string> = {
        1: "Segunda-Feira",
        2: "Segunda-Feira",
        3: "Terça-Feira",
        4: "Quarta-Feira",
        5: "Quinta-Feira",
        6: "Sexta-Feira",
        7: "Sábado",
      };

      dataListaDisponibilidade.value.forEach((el: any, index: number) => {
        el.itens = index + 1;
        el.diaSemana = diasDaSemana[el.diaSemana] || el.diaSemana;
        el.horaInicio = FormatarHoraEditavel(el.horaInicio);
        el.horaFim = FormatarHoraEditavel(el.horaFim);
      });
    };

    const onAddDisponibilidade = () => {
      const data = {
        medicoId: form.value.medicoId,
        diaSemana: form.value.diaSemana,
        horaInicio: form.value.horaInicio,
        horaFim: form.value.horaFim,
      };

      dataDisponibilidade.value.push(data);
      dataPreviewDisponibilidade.value.push(data);

      resetForm();
    };

    const resetForm = () => {
      form.value.medicoId = undefined;
      form.value.diaSemana = undefined;
      adicionarDataAtualInputs();
    };

    const removerDisponibilidade = (index: any) => {
      if (index >= 0 && index < dataListaDisponibilidade.value.length) {
        dataListaDisponibilidade.value.splice(index, 1);
        dataPreviewDisponibilidade.value.splice(index, 1);
      } else {
        console.error("Índice inválido!");
      }
    };

    const adicionarDataAtualInputs = () => {
      const now = new Date();
      const formattedDateTime = now.toISOString().slice(0, 16);
      form.value.horaInicio = formattedDateTime;
      form.value.horaFim = formattedDateTime;
    };

    onMounted(async () => {
      await retornarUtilizador();
      buscarListaDisponibilidade(form.value.medicoId);
      adicionarDataAtualInputs();
    });

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
      dataPreviewDisponibilidade,
      dataDisponibilidade,
      onAddDisponibilidade,
      dataListaDisponibilidade,
      removerDisponibilidade,
      FormatarHoraEditavel,
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
          :items="dataListaDisponibilidade"
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

    <v-dialog v-model="modalAddDisponibilidade" width="65%" persistent>
      <v-card>
        <TitleModal
          title="Adicionar Disponibilidade"
          @fechar="modalAddDisponibilidade = false"
        />
        <v-card-text>
          <div class="forms">
            <div class="formulario">
              <form
                class="spacing"
                @submit.prevent="onSubmitAddDisponibilidade"
              >
                <v-row class="pt-4 pb-4">
                  <v-col cols="12" md="12">
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
                      type="datetime-local"
                      clearable
                      label="Hora Início"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      type="datetime-local"
                      v-model="form.horaFim"
                      clearable
                      label="Hora Fim"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" align="right">
                    <v-btn
                      color="blue"
                      class="mr-2"
                      @click="onAddDisponibilidade"
                    >
                      Adicionar
                    </v-btn>
                    <v-btn type="submit" color="green"> Salvar </v-btn>
                  </v-col>
                </v-row>
              </form>
            </div>

            <div class="display-disponibilidade">
              <v-col cols="12" md="12">
                <v-row class="mt-0">
                  <template v-if="dataPreviewDisponibilidade.length > 0">
                    <v-col
                      cols="12"
                      md="12"
                      v-for="(item, index) in dataPreviewDisponibilidade"
                      :key="index"
                      class="mb-2"
                    >
                      <div class="card-disponibilidade">
                        <div class="container">
                          <div class="card-info">
                            <v-btn @click="removerDisponibilidade(index)">
                              <span>x</span>
                            </v-btn>
                            <p>Dia de Semana: {{ item.diaSemana }}</p>
                            <p>
                              Horário:
                              {{ FormatarHoraEditavel(item.horaInicio) }} até
                              {{ FormatarHoraEditavel(item.horaFim) }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </template>
                  <template v-else>
                    <v-col cols="12" md="12">
                      <div class="sem-resultados">
                        <v-chip class="text-center" color="info"
                          >Não há dados para previsualizar</v-chip
                        >
                      </div>
                    </v-col>
                  </template>
                </v-row>
              </v-col>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.forms {
  display: flex;

  .formulario,
  .display-disponibilidade {
    width: 50%;
  }

  .card-disponibilidade {
    padding: 0.2rem;

    .container {
      display: flex;
      gap: 1rem;

      .card-avatar {
        width: 65px;
        height: 65px;
        background: var(--bg-primary);

        display: flex;
        align-items: center;
        justify-content: center;

        color: #fff;

        span {
          font-weight: bold;
          font-size: 1.5rem;
        }
      }
    }
  }

  .sem-resultados {
    background: #fafafa;
    width: 100%;
    height: 20vh;

    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
