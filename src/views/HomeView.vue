<template>
  <div class="home">
    <div class="container">
      <h1>⚔️ Neornate</h1>
      <p class="subtitle">Idle Dungeon</p>
      <div class="info">
        <p class="version">v1.0.0</p>
        <p class="status">✓ Funcionando correctamente</p>
        <p class="framework">Vue 3 + TypeScript + Capacitor</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
console.log('✓ HomeView cargado')
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0e0e0e 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  text-align: center;
  max-width: 600px;
}

h1 {
  font-size: 64px;
  margin: 0 0 16px 0;
  letter-spacing: 2px;
  color: #ffa500;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.subtitle {
  font-size: 32px;
  margin: 0;
  color: #ff7700;
  letter-spacing: 1px;
}

.info {
  margin-top: 48px;
  padding: 24px;
  background: rgba(255, 165, 0, 0.05);
  border: 2px solid #ffa500;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.info p {
  margin: 8px 0;
  font-size: 14px;
}

.version {
  font-size: 12px;
  color: #aaa;
  font-weight: bold;
}

.status {
  color: #55ff55;
  font-weight: 600;
}

.framework {
  color: #999;
  font-size: 12px;
  margin-top: 16px;
}
</style>
