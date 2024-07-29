<script setup></script>

<template>
  <main class="w-full min-h-[200px] flex flex-col items-center justify-center p-[15px] bg-slate-800 text-white">
    <h1>About</h1>

    <div class="bg-blue-600 text-white p-[12px] rounded-[6px]">
      <router-link :to="{ path: '/' }"> to index </router-link>
    </div>
  </main>
</template>

<style lang="scss" scoped></style>
