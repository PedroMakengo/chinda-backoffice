<script lang="ts">
import { onMounted, ref, computed } from "vue";

import Title from "@/components/Title/index.vue";
import Card from "@/components/Card/index.vue";

// CHART
import { Bar, Doughnut } from "vue-chartjs";
import { UsecaseObterListaMedicoLogado } from "@/Domain/Usecases/Utilizadores/usecase_lista_utilizador";
import {
  Chart as ChartJS,
  Title as TitleDefault,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import { UsecaseDataEstatistica } from "../../Domain/Usecases/Marcacoes/usecase_lista_estatistica";

export default {
  components: { Card, Title, Bar, Doughnut },
  setup() {
    ChartJS.register(
      TitleDefault,
      Tooltip,
      Legend,
      BarElement,
      CategoryScale,
      LinearScale,
      ArcElement,
      Tooltip,
      Legend
    );

    const utilizador = ref<any>("");
    const data = ref({
      ano: 0,
      dia: 0,
      mes: 0,
      totalAnoHora: 0,
      totalMesHora: 0,
      totalDiaHora: 0,
      totalAnoFalta: 0,
      totalMesFalta: 0,
      totalDiaFalta: 0,
    });

    const items = ref([
      {
        id: 1,
        count: 13,
        title: "Dia",
        icon: "mdi mdi-calendar-blank",
        color: "success",
      },
      {
        id: 1,
        count: 13,
        title: "Mês",
        icon: "mdi mdi-calendar-blank",
        color: "success",
      },
      {
        id: 1,
        count: 13,
        title: "Ano",
        icon: "mdi mdi-calendar-blank",
        color: "success",
      },
      {
        id: 1,
        count: 13,
        title: "Dia",
        icon: "mdi mdi-calendar-blank",
        color: "error",
      },
      {
        id: 1,
        count: 13,
        title: "Mês",
        icon: "mdi mdi-calendar-blank",
        color: "error",
      },
      {
        id: 1,
        count: 13,
        title: "Ano",
        icon: "mdi mdi-calendar-blank",
        color: "error",
      },
    ]);
    const dataEmployee = ref([]);

    // Configurações Gráfico
    const chartData = {
      labels: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      datasets: [
        {
          backgroundColor: ["#2e8ceb", "#2e8ceb", "#00D8FF"],
          data: [40, 20, 12],
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    // DATA SEGUNDO GRÁFICO
    const dataPiaGrafico = {
      labels: ["Utentes", "Médicos", "Especialista"],
      datasets: [
        {
          backgroundColor: ["#2e8ceb", "#2e8ceb", "#00D8FF"],
          data: [40, 20, 10],
        },
      ],
    };

    // UTILIZADOR
    const nome = ref("");

    const obterInformacoesUtilizadorLogado = async () => {
      const response = await UsecaseObterListaMedicoLogado.handler();
      utilizador.value = response?.object;

      nome.value = utilizador.value?.userName;
    };

    const estatistica = ref<any>({});

    const dataListaEstatistica = async () => {
      const response = await UsecaseDataEstatistica.handler();
      estatistica.value = response?.object;
    };

    const nomeDoUtilizador = computed(() => {
      return `${nome.value}`;
    });

    onMounted(() => {
      obterInformacoesUtilizadorLogado();
      dataListaEstatistica();
    });

    return {
      items,
      dataEmployee,
      data,
      chartData,
      chartOptions,
      dataPiaGrafico,
      nomeDoUtilizador,
      estatistica,
    };
  },
};
</script>

<template>
  <div class="container">
    <Title title="D A S H B O A R D - C H I N D A" />
    <v-row class="mb-4 mt-4">
      <v-col cols="12" md="12">
        <div class="cores">
          <v-btn size="small" class="faltas"
            >Seja bem-vindo, <b>{{ nomeDoUtilizador }}</b>
            <span></span>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <div class="dashboard">
      <Card
        icon="mdi mdi-calendar-blank"
        title="Médicos"
        :count="estatistica.medicos"
        color="info"
        class="card"
      />
      <Card
        icon="mdi mdi-calendar-blank"
        title="Utentes"
        :count="estatistica.utentes"
        color="info"
        class="card"
      />
      <Card
        icon="mdi mdi-calendar-blank"
        title="Especialistas"
        :count="estatistica.especialidades"
        color="info"
        class="card"
      />

      <Card
        icon="mdi mdi-calendar-blank"
        title="Pedidos"
        :count="estatistica.pedidos"
        color="info"
        class="card"
      />

      <Card
        icon="mdi mdi-calendar-blank"
        title="Utilizadores"
        :count="estatistica.utilizadores"
        color="info"
        class="card"
      />
    </div>

    <div class="graficos">
      <div class="">
        <Bar :options="chartOptions" :data="chartData" style="width: 100%" />
      </div>

      <div class="">
        <Doughnut
          :options="chartOptions"
          :data="dataPiaGrafico"
          style="width: 100%"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("./styles.module.scss");
</style>
