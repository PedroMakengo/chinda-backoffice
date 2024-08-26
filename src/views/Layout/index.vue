<style lang="scss" scoped>
@import url(./styles.scss);
</style>

<template>
  <v-layout class="vLayout" style="background-color: #eff4f8">
    <Navbar />
    <TopBar />

    <v-main
      class="d-flex align-center justify-center ma-7 main"
      style="min-height: 300px"
    >
      <router-view v-slot="{ Component }">
        <v-fade-transition mode="out-in">
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import Navbar from "@/components/navbar/index.vue";
import TopBar from "@/components/TopBar/index.vue";
</script>
