import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuResponsivo = defineStore("storeMenuResponsivo", () => {
  const rail = ref(false);

  return {
    rail,
  };
});
