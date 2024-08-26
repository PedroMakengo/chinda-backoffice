<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { authStore } from "@/stores/store_autenticacao";
import { UsecaseUtilizadorResetPassword } from "@/Domain/Usecases/Utilizadores/utilizador_reset_password";

import { useToast } from "vue-toastification";

export default defineComponent({
  setup() {
    const form = ref<any>({
      password: undefined!,
      email: undefined!,
      token: undefined!,
    });

    const toast = useToast();

    const handleToken = async () => {
      form.value.token = await authStore.getToken().token;
    };
    // SUBMIT RESET PASSWORD
    const onSubmitResetPassword = async () => {
      const data = {
        password: form.value.password,
        token: form.value.token,
        email: form.value.email,
      };

      const response = await UsecaseUtilizadorResetPassword.store(data);

      console.log(response);

      if (response?.success) {
        toast.success(response?.object, {
          timeout: 3000,
        });
      } else {
        toast.error(response?.object, {
          timeout: 3000,
        });
      }
    };

    onMounted(() => {
      handleToken();
    });
    return { form, onSubmitResetPassword };
  },
});
</script>

<template>
  <main class="reset-container-password">
    <div class="container">
      <div class="header-reset-form">
        <h1>Recuperar Senha</h1>
        <p>Insira seu endereço de e-mail e uma nova senha.</p>
      </div>
      <div class="reset-form">
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field label="E-mail" v-model="form.email"></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field
              label="Nova Senha"
              v-model="form.password"
              type="password"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-btn @click="onSubmitResetPassword">Reset Password</v-btn>
            <p class="reset-password">
              Lembrou da senha ?
              <router-link to="/">Iniciar Sessão</router-link>
            </p>
          </v-col>
        </v-row>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
@import url(./styles.module.scss);
</style>
