<template>
  <v-app>
    <v-main>
      <nav>
        <RouterLink to="/">Go to Home</RouterLink>
        <RouterLink to="/about">Go to About</RouterLink>
      </nav>

      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>
