<template>
  <i :class="icon"></i>
</template>

<script setup lang="ts">
interface Props {
  icon: string
}

defineProps<Props>()
</script>

<style scoped>
i {
  display: inline-block;
  font-style: normal;
}
</style>
