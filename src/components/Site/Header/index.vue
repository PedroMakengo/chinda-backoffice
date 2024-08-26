<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const isCadastro = ref(false);

    return { isCadastro };
  },
});
</script>

<template>
  <header class="header">
    <div class="container-header">
      <div></div>
      <nav>
        <!-- <router-link to="/login">Clique aqui</router-link> -->
        <!-- <router-link to="/login" exact>Login</router-link> -->
        <router-link to="/cadastro">Registrar-se</router-link>
      </nav>
    </div>
    <div class="container">
      <div class="logo">
        <h2>Chinda</h2>
      </div>
      <nav>
        <router-link to="/" class="active">Página Inicial</router-link>
        <router-link to="/#">Notícias & Eventos</router-link>
        <router-link to="/#">Sobre Nós</router-link>
        <router-link to="/#">Dúvidas</router-link>
        <router-link to="/#">Contactos</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
@import url("./styles.scss");
</style>
