<script setup></script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1
          class="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        >
          About Page
        </h1>
      </div>

      <!-- Content -->
      <div class="mb-8 text-center">
        <p class="text-slate-300">Welcome to the about page of our demo application.</p>
      </div>

      <!-- Navigation -->
      <div class="flex justify-center">
        <router-link
          to="/"
          class="group px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span>Back to Home</span>
        </router-link>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped></style>
