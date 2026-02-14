<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useSkillsStore } from '@/stores/skillsStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { usePlayerStore } from '@/stores/playerStore'
import { Skill } from '@/types/Game'
import { faTerminal } from '@fortawesome/free-solid-svg-icons'

// Solo en desarrollo
const isDev = import.meta.env.DEV

const skillsStore = useSkillsStore()
const inventoryStore = useInventoryStore()
const playerStore = usePlayerStore()

const isOpen = ref(false)
const input = ref('')
const logs = ref<Array<{ message: string; type: 'info' | 'error' | 'success' | 'command' }>>([])
const scrollContainer = ref<HTMLDivElement>()

// Comandos disponibles
const commands = {
  'help': () => {
    log('=== Comandos Disponibles ===', 'info')
    log('skill set <skill> <level> - Cambiar nivel de skill', 'info')
    log('skill xp <skill> <amount> - Añadir XP a skill', 'info')
    log('inventory add <itemId> <qty> - Añadir item al inventario', 'info')
    log('inventory clear - Limpiar inventario', 'info')
    log('player level <level> - Cambiar nivel del jugador', 'info')
    log('player gold <amount> - Establecer oro', 'info')
    log('clear - Limpiar logs de consola', 'info')
    log('state - Ver estado actual del juego', 'info')
  },

  'skill': (args: string[]) => {
    if (args.length < 2) {
      log('Uso: skill set <skill> <level> | skill xp <skill> <amount>', 'error')
      return
    }

    const action = args[0]
    const skillName = args[1].toUpperCase()
    const skillKey = Object.entries(Skill).find(([key]) => key === skillName)?.[1]

    if (!skillKey) {
      log(`❌ Skill no encontrado: ${skillName}. Skills disponibles: ${Object.keys(Skill).join(', ')}`, 'error')
      return
    }

    if (action === 'set') {
      const level = parseInt(args[2], 10)
      if (isNaN(level) || level < 1 || level > 120) {
        log('❌ Nivel debe estar entre 1 y 120', 'error')
        return
      }
      const skillState = skillsStore.getSkillState(skillKey as Skill)
      skillState.level = level
      log(`✅ ${skillName} -> Nivel ${level}`, 'success')
    } else if (action === 'xp') {
      const amount = parseInt(args[2], 10)
      if (isNaN(amount) || amount < 0) {
        log('❌ XP debe ser un número positivo', 'error')
        return
      }
      skillsStore.addExperience(skillKey as Skill, amount)
      log(`✅ +${amount} XP en ${skillName}`, 'success')
    } else {
      log('❌ Acción desconocida. Usa: skill set | skill xp', 'error')
    }
  },

  'inventory': (args: string[]) => {
    if (args.length === 0) {
      log('Uso: inventory add <itemId> <qty> | inventory clear', 'error')
      return
    }

    const action = args[0]

    if (action === 'add') {
      if (args.length < 3) {
        log('Uso: inventory add <itemId> <qty>', 'error')
        return
      }
      const itemId = args[1]
      const qty = parseInt(args[2], 10)
      if (isNaN(qty) || qty < 1) {
        log('❌ Cantidad debe ser un número positivo', 'error')
        return
      }

      // Buscar item en skillProducts
      const item = Object.values(skillsStore.skillStates).flatMap(s => s.products)
        .find(p => p.item.id === itemId)?.item

      if (!item) {
        log(`❌ Item no encontrado: ${itemId}`, 'error')
        return
      }

      inventoryStore.addItem(item, qty)
      log(`✅ +${qty}x ${itemId}`, 'success')
    } else if (action === 'clear') {
      // Resetear inventario
      inventoryStore.clear()
      log('✅ Inventario limpiado', 'success')
    } else {
      log('❌ Acción desconocida. Usa: inventory add | inventory clear', 'error')
    }
  },

  'player': (args: string[]) => {
    if (args.length < 2) {
      log('Uso: player level <level> | player gold <amount>', 'error')
      return
    }

    const action = args[0]
    const value = parseInt(args[1], 10)

    if (isNaN(value) || value < 0) {
      log('❌ Valor debe ser un número positivo', 'error')
      return
    }

    if (action === 'level') {
      if (value < 1 || value > 120) {
        log('❌ Nivel debe estar entre 1 y 120', 'error')
        return
      }
      playerStore.player.level = value
      log(`✅ Nivel del jugador: ${value}`, 'success')
    } else if (action === 'gold') {
      playerStore.player.gold = value
      log(`✅ Oro: ${value}`, 'success')
    } else {
      log('❌ Acción desconocida. Usa: player level | player gold', 'error')
    }
  },

  'state': () => {
    log('=== Estado Actual ===', 'info')
    log(`Jugador: Nivel ${playerStore.player.level}, Oro ${playerStore.player.gold}`, 'info')
    
    // Skills
    log('--- Skills ---', 'info')
    Object.entries(skillsStore.skillStates).forEach(([skillKey, skillState]) => {
      log(`${skillKey}: Lvl ${skillState.level} (${skillState.experience}/${skillState.experience + 100} XP)`, 'info')
    })

    // Inventario
    log('--- Inventario ---', 'info')
    const itemCount = inventoryStore.inventory.items.length
    log(`Total items: ${itemCount}`, 'info')
    inventoryStore.inventory.items.forEach((stack: any) => {
      log(`  ${stack.itemId}: ${stack.quantity}`, 'info')
    })
  },

  'clear': () => {
    logs.value = []
    log('🔄 Consola limpiada', 'info')
  },
}

// Ejecutar comando
const executeCommand = () => {
  if (!input.value.trim()) return

  const trimmed = input.value.trim()
  log(`> ${trimmed}`, 'command')

  const parts = trimmed.split(/\s+/)
  const baseCommand = parts[0]?.toLowerCase()
  const args = parts.slice(1)

  if (baseCommand === 'help' || baseCommand === '?') {
    commands.help()
  } else if (baseCommand && baseCommand in commands) {
    const cmdFunc = commands[baseCommand as keyof typeof commands]
    if (typeof cmdFunc === 'function') {
      try {
        if (args.length > 0) {
          (cmdFunc as any)(args)
        } else {
          (cmdFunc as any)()
        }
      } catch (error) {
        log(`❌ Error: ${(error as Error).message}`, 'error')
      }
    }
  } else {
    log(`❌ Comando desconocido: ${baseCommand}. Escribe "help" para ver disponibles`, 'error')
  }

  input.value = ''
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  })
}

// Log helper
const log = (message: string, type: 'info' | 'error' | 'success' | 'command' = 'info') => {
  logs.value.push({ message, type })
  // Limitar logs a últimos 50
  if (logs.value.length > 50) {
    logs.value.shift()
  }
}

// Tecla enter en input
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    executeCommand()
  }
}

// Toggle consola con F1
const handleF1 = (e: KeyboardEvent) => {
  if (e.key === 'F1') {
    e.preventDefault()
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      nextTick(() => {
        const inputEl = document.querySelector('.dev-console-input') as HTMLInputElement
        inputEl?.focus()
      })
    }
  }
}

// Setup listeners
if (isDev) {
  window.addEventListener('keydown', handleF1)
}

// Mensaje de bienvenida
if (isDev) {
  log('Dev Console iniciada. Presiona F1 para cerrar. Escribe "help" para ver comandos.', 'info')
}
</script>

<template>
  <!-- Solo renderizar en desarrollo -->
  <div v-if="isDev" class="dev-console-wrapper" :class="{ open: isOpen }">
    <!-- Botón flotante (cuando está cerrada) -->
    <button v-if="!isOpen" class="dev-console-float" @click="isOpen = true" title="F1">
      <FaIcon :icon="faTerminal" />
    </button>

    <!-- Panel de consola - PANTALLA COMPLETA INFERIOR -->
    <transition name="console-slide">
      <div v-if="isOpen" class="dev-console">
        <!-- Logs -->
        <div ref="scrollContainer" class="dev-console-logs">
          <div v-for="(logEntry, idx) in logs" :key="idx" class="log-entry" :class="logEntry.type">
            {{ logEntry.message }}
          </div>
        </div>

        <!-- Input + Header -->
        <div class="dev-console-input-wrapper">
          <span class="prompt">$</span>
          <input
            class="dev-console-input"
            v-model="input"
            placeholder="Escribe comando (help para ayuda) | F1 para cerrar"
            @keydown="handleKeydown"
          />
          <button class="close-btn" @click="isOpen = false" title="F1">✕</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dev-console-wrapper {
  --console-height: 200px;
  --console-bg: #0a0a0a;
  --console-border: #222;
  --console-text: #e0e0e0;
}

/* Botón flotante */
.dev-console-float {
  position: fixed;
  bottom: 10px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 165, 0, 0.7);
  border: 1px solid var(--color-primary);
  cursor: pointer;
  z-index: 5000;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  :deep(svg) {
    font-size: 18px;
    color: #fff;
  }

  &:hover {
    background: var(--color-primary);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

/* Panel consola - OCUPAR TODO EL ANCHO INFERIOR */
.dev-console {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: var(--console-height);
  background: var(--console-bg);
  border-top: 1px solid var(--console-border);
  display: flex;
  flex-direction: column;
  z-index: 5001;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.7);
}

/* Header */
.dev-console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 15px;
  border-bottom: 1px solid var(--console-border);
  background: rgba(0, 0, 0, 0.5);
  flex-shrink: 0;

  h3 {
    margin: 0;
    font-size: 12px;
    color: var(--color-primary);
    font-weight: 600;
    letter-spacing: 0.5px;
  }
}

.close-btn {
  background: none;
  border: none;
  color: var(--console-text);
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
    color: var(--color-danger);
  }
}

/* Logs - OCUPAR TODO EL ESPACIO DISPONIBLE */
.dev-console-logs {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 15px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.3;
  background: rgba(0, 0, 0, 0.2);

  /* Scrollbar personalizado */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 165, 0, 0.4);
    border-radius: 2px;

    &:hover {
      background: rgba(255, 165, 0, 0.6);
    }
  }
}

.log-entry {
  margin: 1px 0;
  padding: 1px 0;
  white-space: pre-wrap;
  word-break: break-word;

  &.command {
    color: var(--color-primary);
    font-weight: 600;
  }

  &.info {
    color: #888;
    font-size: 10px;
  }

  &.success {
    color: var(--color-success);
  }

  &.error {
    color: var(--color-danger);
  }
}

/* Input */
.dev-console-input-wrapper {
  display: flex;
  align-items: center;
  padding: 6px 15px;
  border-top: 1px solid var(--console-border);
  background: rgba(0, 0, 0, 0.3);
  gap: 6px;
  flex-shrink: 0;
}

.prompt {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 11px;
  min-width: 12px;
}

.dev-console-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: none;
  color: var(--console-text);
  padding: 5px 8px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  outline: none;
  height: 24px;

  &:focus {
    background: rgba(255, 165, 0, 0.08);
    border-bottom: 1px solid rgba(255, 165, 0, 0.4);
  }

  &::placeholder {
    color: rgba(224, 224, 224, 0.3);
  }
}

/* Animación */
.console-slide-enter-active,
.console-slide-leave-active {
  transition: all 0.2s ease;
}

.console-slide-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.console-slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
