<script lang="ts">
import { defineComponent, ref } from "vue";
import $router from "@/router";

import { storeAutenticacao } from "@/Domain/Usecases/Geral/Autenticacao";
import { useToast } from "vue-toastification";

export default defineComponent({
  setup() {
    // VARIÁVEIS
    const toast = useToast();
    const email = ref("");
    const checkbox = ref(true);
    const password = ref("");
    const loading = ref(false);

    const store = storeAutenticacao();

    const showPassword = ref(false);

    const rules = {
      required: (value: string) => !!value,
      required2: (value: string) => !!value,
    };

    // FUNÇÕES

    const onSubmitLogin = async () => {
      const user = {
        utilizador: email.value,
        senha: password.value,
      };

      loading.value = true;
      const { response, utilizador }: any = await store.login(
        user.utilizador,
        user.senha
      );

      // Salvar o utilizador

      loading.value = false;

      if (response?.statusCode === 200 && response?.success === true) {
        store.setUtilizador(utilizador);
        $router.replace("/dashboard");
      } else {
        toast.error(`${response?.object.detail}`, {
          timeout: 3000,
        });
        loading.value = false;
      }
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      togglePasswordVisibility,
      onSubmitLogin,
      email,
      password,
      rules,
      checkbox,
      showPassword,
      loading,
    };
  },
});
</script>

<template>
  <div class="main">
    <div class="banner-info">
      <!-- <h1>Fica tudo aqui...</h1> -->
    </div>

    <div class="content-formulario">
      <form @submit.prevent="onSubmitLogin" class="formulario-login">
        <v-text-field
          v-model="email"
          label="E-mail"
          variant="outlined"
          type="next"
          density="default"
          :rules="[rules.required]"
          v-on:keyup.enter="$event.target.nextElementSibling.focus()"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          name="input-10-1"
          label="Palavra-Passe  "
          variant="outlined"
          density="default"
          :rules="[rules.required2]"
          @click:append-inner="togglePasswordVisibility()"
        ></v-text-field>

        <v-btn block type="submit" :loading="loading"> Iniciar Sessão </v-btn>

        <p class="reset-password">
          Esqueceu a tua senha ?
          <router-link to="/reset-password">Redefinir senha</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url(./styles.scss);
</style>
