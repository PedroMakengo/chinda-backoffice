<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { UsecaseObterListaMedicoLogado } from "@/Domain/Usecases/Utilizadores/usecase_lista_utilizador";
import { useMenuResponsivo } from "../../stores/store_rail";

// Menu
const store = useMenuResponsivo();

const codigo = ref("");

const utilizador = ref<any>({});
const nome = ref("");

const obterInformacoesUtilizadorLogado = async () => {
  const response = await UsecaseObterListaMedicoLogado.handler();
  utilizador.value = response?.object;

  nome.value = utilizador.value?.userName;
};

const nomeDoUtilizador = computed(() => {
  return `${nome.value}`;
});

onMounted(() => {
  obterInformacoesUtilizadorLogado();
});
</script>

<template>
  <v-toolbar color="white" class="fixed-bar">
    <v-app-bar class="container">
      <div class="content">
        <div class="title">
          <h4>Plataforma para Médicos</h4>
        </div>
        <div class="menu-mobile">
          <h5>Software Chinda</h5>
        </div>
        <div class="d-flex justify-space-between cursor">
          <div id="menu-activator" class="ml-4 avatar">
            <v-avatar size="34px" class="mr-4">
              <v-icon
                size="large"
                icon="mdi-account-circle"
                alt="Avatar"
              ></v-icon>
            </v-avatar>
            <div class="avatar-user">
              <strong :title="codigo"> {{ nomeDoUtilizador }} </strong>
            </div>
          </div>
        </div>
      </div>
    </v-app-bar>
  </v-toolbar>
</template>

<style lang="scss" scoped>
@import url(./style.module.scss);
</style>
