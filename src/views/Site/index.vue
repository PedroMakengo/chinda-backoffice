<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Header from "@/components/Site/Header/index.vue";

export default defineComponent({
  components: { Header },
  setup() {
    const forms = ref({});
    const modalPedidos = ref(false);

    const handleSubmitVinculos = () => {};

    return {
      modalPedidos,
      handleSubmitVinculos,
    };
  },
});
</script>

<template>
  <div class="main">
    <Header />

    <div class="banner">
      <div class="container">
        <div class="content">
          <h1>
            Mais de 100 médicos<br />
            confiáveis estão aqui
          </h1>
          <p>
            Descubra o médico perfeito para você, que compreenda suas
            necessidades de saúde únicas e ofereça um atendimento personalizado
            e de excelência, garantindo o seu bem-estar, qualidade de vida e a
            tranquilidade de saber que está em boas mãos.
          </p>
        </div>
      </div>
    </div>

    <section class="mission">
      <div class="container">
        <div class="item active">
          <span class="mdi mdi-information-outline"></span>
          <h3>Sobre nós</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed iste
            corrupti vel quae, nemo architecto ut ullam amet,
          </p>
        </div>
        <div class="item">
          <span class="mdi mdi-account-group"></span>
          <h3>Médicos</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed iste
            corrupti vel quae, nemo architecto ut ullam amet,
          </p>
        </div>
        <div class="item">
          <span class="mdi mdi-cog"></span>
          <h3>Missão</h3>
          <p>
            A nossa missão é oferecer atendimento médico de qualidade no conforto do seu lar, 
            tornando a saúde mais acessível e personalizada. 
            Conectamos pacientes a médicos qualificados para garantir um cuidado humano, 
            seguro e eficiente, promovendo o bem-estar e a qualidade de vida.
          </p>
        </div>
      </div>
    </section>

    <section class="about">
      <div class="container">
        <div class="content-principal">
          <div class="cover">
            <img src="../../assets/imgs/about.jpg" alt="" />
          </div>
          <div class="description">
            <span>The Great Place Of</span>
            <h4>Medical Hospital Center</h4>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
              nemo expedita dicta dolor maxime eveniet sequi vero voluptatibus
              laboriosam nobis animi enim illum temporibus accusantium, at
              repellat soluta beatae fugiat.
            </p>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
              nemo expedita dicta dolor maxime eveniet sequi vero voluptatibus
              laboriosam nobis animi enim illum temporibus accusantium, at
              repellat soluta beatae fugiat.
            </p>
          </div>
        </div>

        <div class="content-secondary">
          <h2>Serviços</h2>
          <div class="items">
            <div class="item" v-for="(item, index) in 3" :key="index">
              <img src="" />
              <h5>Rehab Centre</h5>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="app">
      <div class="container">
        <h2>Nosso Aplicativo</h2>

        <div class="content-app">
          <div class="app">
            <img src="../../assets/imgs/app.png" />
          </div>

          <div class="descricao">
            <h2>Conheça o nosso aplicativo</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
              minima nemo corporis, officia aperiam molestiae ut, modi autem
              dolorum quidem iure facilis odio dicta! Iste fugiat accusamus
              pariatur sit at.
            </p>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
              minima nemo corporis, officia aperiam molestiae ut, modi autem
              dolorum quidem iure facilis odio dicta! Iste fugiat accusamus
              pariatur sit at.
            </p>

            <div class="dowloand">
              <a href=""></a>
              <a href=""></a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="testemunhos">
      <div class="container">
        <h2>Testemunhos</h2>

        <div class="content-testemunhos">
          <div class="item" v-for="(item, index) in 6" :key="index">
            <img src="" />
            <h4>Nome testemunha</h4>
            <p>Eu gostei bastante desta aplicação poís é muito simples</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import url("./styles.scss");
</style>
