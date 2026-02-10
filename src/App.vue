<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  // Si accedemos directamente a una ruta que no sea /loading, ir a loading
  if (router.currentRoute.value.path !== '/loading') {
    // Usar sessionStorage para saber si es primera carga
    const isFirstLoad = !sessionStorage.getItem('app-initialized')
    if (isFirstLoad) {
      sessionStorage.setItem('app-initialized', 'true')
      router.push('/loading')
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0e0e0e;
  color: #e0e0e0;
  overflow: hidden;
}
</style>

