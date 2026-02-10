import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const player = ref({
    name: 'Aventurero',
    level: 1,
    experience: 0,
  })

  const setPlayerName = (name: string) => {
    player.value.name = name
  }

  return {
    player,
    setPlayerName,
  }
})
