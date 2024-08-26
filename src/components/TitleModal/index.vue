<script lang="ts" setup>
const props = defineProps({
  title: String,
});

const emit = defineEmits(["fechar"]);

function fecharModal() {
  emit("fechar");
}
</script>

<template>
  <div class="containerTitle">
    <v-card-title class="content">
      <span class="text-h5">{{ title }}</span>
      <v-btn
        icon="mdi-close"
        @click="fecharModal"
        size="x-small"
        class="btnModalMargem"
      ></v-btn>
    </v-card-title>
  </div>
</template>

<style lang="scss" scoped>
@import url("./styles.scss");
</style>
