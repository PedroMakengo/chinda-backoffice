<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import $router from "@/router";
import { authStore } from "@/stores/store_autenticacao";
import { listaMenuPrincipal } from "./menu";
import { useMenuResponsivo } from "../../stores/store_rail";

const terminarSessao = () => {
  authStore.deleteToken();
  authStore.deleteUtilizador();

  $router.replace("/");
};

const store = useMenuResponsivo();

const drawer = ref(true);
const dialog = ref(false);
const perfil = ref("");

const retornarUtilizador = async () => {
  let responseLocalStorage: any = await authStore.getUser();
  perfil.value = responseLocalStorage.perfis[0];
};

const filtrarRotasPorPerfil = computed(() => {
  if (perfil.value === "Medico") {
    return listaMenuPrincipal.filter(
      (rota) => rota.value === "consultas" || rota.value === "disponibilidade"
      // rota.value === "perfil"
    );
  } else if (perfil.value === "Admin") {
    return listaMenuPrincipal.filter(
      (rota) => rota.value !== "disponibilidade"
    );
  }
  return [];
});

onMounted(() => {
  retornarUtilizador();
});
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="store.rail"
    @click="store.rail = false"
    class="container-navbar"
  >
    <!-- prepend-avatar="../../assets/imgs/logo/isFactory.png" -->
    <v-list-item
      prepend-icon="mdi-home-1"
      nav
      class="mt-2"
      @click="$router.push('/dashboard')"
    >
      <template v-slot>
        <v-list-item-title class="custom-title">C H I N D A</v-list-item-title>
      </template>
      <template v-slot:append>
        <v-btn
          variant="text"
          icon="mdi-chevron-left"
          @click.stop="store.rail = !store.rail"
        ></v-btn>
      </template>
    </v-list-item>

    <v-list>
      <v-list-item
        prepend-icon="mdi-home"
        @click="$router.push('/dashboard')"
        title="Home"
        value="home"
      ></v-list-item>

      <template v-for="(item, index) in filtrarRotasPorPerfil" :key="index">
        <v-list-item
          :prepend-icon="item.prependIcon"
          @click="$router.push(item.route)"
          :value="item.value"
          :title="item.title"
        >
        </v-list-item>
      </template>
    </v-list>

    <!-- Modal -->
    <v-dialog v-model="dialog" width="auto">
      <template v-slot:activator="{ props }">
        <v-col class="btnSair">
          <v-btn variant="tonal" width="290" v-bind="props">Sair</v-btn>
        </v-col>
      </template>
      <v-card>
        <v-card-text> Tens certeza que desejas sair da aplicação? </v-card-text>
        <v-card-actions class="containerButons">
          <v-btn color="blue" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="blue" @click="terminarSessao()">Sair </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Modal -->
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
@import url(./styles.scss);
</style>
