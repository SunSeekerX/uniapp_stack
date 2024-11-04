<template>
  <div class="build-info">
    <p>Build Time: {{ buildTime }}</p>
    <p>Build Hash: {{ buildHash }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const buildTime = ref('')
const buildHash = ref('')

onMounted(() => {
  fetch('/build-info.txt')
    .then((response) => response.text())
    .then((text) => {
      const lines = text.split('\n')
      buildTime.value = lines[0].replace('Build Time: ', '')
      buildHash.value = lines[1].replace('Build Hash: ', '')
    })
})
</script>

<style scoped>
.build-info {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
  background-color: #409eff;
  color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
