<script lang="ts" setup>
const props = defineProps({
  title: String,
});
</script>

<template>
  <div class="title">
    <h4>{{ title }}</h4>
  </div>
</template>

<style lang="scss" scoped>
@import url("./styles.scss");
</style>
