<script lang="ts">
import { defineComponent, ref } from "vue";

import Title from "@/components/Title/index.vue";

import MedicosAprovados from "./components/Aprovados/index.vue";

export default defineComponent({
  components: { Title, MedicosAprovados },
  setup() {
    // VARIAVEIS
    const tab = ref({ tab: "option-2" });

    return {
      tab,
    };
  },
});
</script>

<template>
  <div class="container">
    <Title title="MÉDICOS" />

    <div class="container mt-4">
      <div class="bg-white">
        <v-tabs
          v-model="tab"
          direction="horizontal"
          color="primary"
          align-tabs="start"
          class="tab"
        >
          <v-tab value="option-1">Médicos</v-tab>
        </v-tabs>
      </div>
      <v-window v-model="tab" class="mt-4">
        <v-window-item value="option-1">
          <v-card flat>
            <MedicosAprovados />
          </v-card>
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<style scoped lang="scss">
.borderItems {
  background: #eff4f8;
  margin-bottom: 1rem;
  padding: 0.6rem;

  text-transform: uppercase;
  font-weight: bold;
}
</style>
