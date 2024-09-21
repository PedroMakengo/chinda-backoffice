<script lang="ts">
import { defineComponent, ref } from "vue";
import Title from "@/components/Title/index.vue";

export default defineComponent({
  components: { Title },
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="container">
    <Title title="DISPONIBILIDADE" />
  </div>
</template>
