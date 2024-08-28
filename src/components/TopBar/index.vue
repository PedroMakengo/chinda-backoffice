<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { UsecaseObterListaMedicoLogado } from "@/Domain/Usecases/Utilizadores/usecase_lista_utilizador";

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
.fixed-bar {
  position: fixed;
  position: -webkit-sticky; /* for Safari */
  z-index: 2;

  .container {
    width: 100%;
    height: 100%;
    background: #fff;

    .content {
      margin: 0 auto !important;
      width: 97% !important;
      height: 100% !important;
      align-items: center;

      padding-left: 0 !important;

      display: flex !important;
      justify-content: space-between !important;

      .title {
        display: flex;
        align-items: center;
        height: 100%;

        h4 {
          text-transform: uppercase;
        }
      }

      .avatar {
        display: flex;
        align-items: center;

        .avatar-user {
          display: flex;
          flex-direction: column;

          span {
            font-size: 0.8rem;
          }
        }
      }
    }

    .cursor {
      cursor: pointer !important;
    }
  }
}

.SelectModalEmpresa {
  font-weight: 500;
  backdrop-filter: blur(2px) !important;
}

.butttonItemEmpresa {
  border-radius: 0 !important;
  margin-top: 1rem;
  background-color: #2e8ceb !important;
  padding: 1.3rem !important;
  font-weight: 300;
}

.TopCardSelectEmpresa {
  background-color: #2e8ceb;
  padding: 1rem;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 0.9px;
}
</style>
