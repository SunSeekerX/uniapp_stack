<script setup>
import * as kiwi from '@/kiwi'
</script>

<template>
  <RouterView />
  <BuildInfo v-if="!kiwi.env.viteIsProd" />
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  font-weight: normal;
}

body {
  min-height: 100vh;
  transition:
    color 0.5s,
    background-color 0.5s;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;

  /* font-size: 15px; */
  text-rendering: optimizelegibility;

  /* background: #070a29; */
}
</style>
