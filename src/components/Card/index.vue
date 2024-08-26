<script lang="ts" setup>
const props = defineProps({
  count: Number,
  title: String,
  color: String,
  icon: String,
});
</script>

<template>
  <div :class="`container ${color}`">
    <div class="contador">
      <h2>{{ count }}</h2>
      <p>{{ title }}</p>
    </div>
    <div :class="`${color} icon`" color="primary">
      <v-icon :icon="icon"></v-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url("./styles.scss");
</style>
