<template>
  <div class="settings-view">
    <h1>{{ t('ui.menu.settings') }}</h1>

    <div class="settings-container">
      <!-- Language Settings -->
      <div class="settings-section">
        <div class="section-header">
          <h2>🌐 {{ t('labels.language') }}</h2>
        </div>
        <div class="section-content">
          <select
            class="language-select"
            :value="locale"
            @change="(e) => setLocale((e.target as HTMLSelectElement).value as Locale)"
          >
            <option value="es">{{ t('labels.spanish') }}</option>
            <option value="en">{{ t('labels.english') }}</option>
          </select>
        </div>
      </div>

      <!-- More settings can be added here -->
      <div class="settings-section">
        <div class="section-header">
          <h2>⚙️ {{ t('ui.menu.settings') }}</h2>
        </div>
        <div class="section-content">
          <p class="placeholder">{{ t('messages.loading') }}...</p>
        </div>
      </div>

      <!-- Clear All Data -->
      <div class="settings-section danger-section">
        <div class="section-header">
          <h2><FaIcon icon="fa-solid fa-triangle-exclamation" /> {{ t('labels.danger') }}</h2>
        </div>
        <div class="section-content">
          <p class="warning-text">⚠️ {{ t('messages.danger_zone') }}</p>
          <button class="btn-danger" @click="clearAllData">
            <FaIcon icon="fa-solid fa-trash" /> {{ t('labels.clear_all_data') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n, type Locale } from '@/composables/useI18n'
import { useNotification } from '@/composables/useNotification'
import {
  useGameStore,
  usePlayerStore,
  useInventoryStore,
  useSkillsStore,
  useMarketStore,
} from '@/stores'
import { useToolsStore } from '@/stores/toolsStore'

const { t, locale, setLocale } = useI18n()
const { confirm, success, error } = useNotification()

const clearAllData = async () => {
  // Confirmar con popup elegante
  await confirm(
    t('labels.danger'),
    t('messages.clear_all_data_confirm'),
    async () => {
      // Segunda confirmación
      const doubleConfirmed = await confirm(
        `⚠️ ${t('labels.second_confirmation')}`,
        t('messages.clear_all_data_double_confirm'),
      )

      if (!doubleConfirmed) return

      try {
        console.log('🔄 Iniciando limpieza de datos...')

        // 1. Eliminar todas las claves específicas de los stores
        const keysToDelete = [
          'neornate_player',
          'neornate_inventory',
          'neornate_skills',
          'neornate_market',
          'tools_equipped',
          'tools_inventory',
          'neornate_lastActiveTime',
          'neornate_inventory_migrated_v1',
          'neornate_inventory_migrated_v2',
        ]

        console.log('1️⃣ Eliminando claves específicas...')
        keysToDelete.forEach((key) => {
          try {
            localStorage.removeItem(key)
            console.log(`  ✓ Eliminada clave: ${key}`)
          } catch (err) {
            console.warn(`  ⚠️ Error eliminando ${key}:`, err)
          }
        })

        // 2. Limpiar localStorage completamente como medida extra
        console.log('2️⃣ Ejecutando localStorage.clear()...')
        localStorage.clear()
        console.log('✓ localStorage limpiado. Claves restantes:', localStorage.length)

        // 3. Resetear todos los stores a su estado inicial
        console.log('3️⃣ Reseteando stores...')

        try {
          const gameStore = useGameStore()
          console.log('  ✓ gameStore obtenido')
          gameStore.reset()
          console.log('  ✓ gameStore reseteado')
        } catch (err) {
          console.error('  ❌ Error en gameStore:', err)
        }

        try {
          const playerStore = usePlayerStore()
          console.log('  ✓ playerStore obtenido')
          playerStore.reset()
          console.log('  ✓ playerStore reseteado')
        } catch (err) {
          console.error('  ❌ Error en playerStore:', err)
        }

        try {
          const inventoryStore = useInventoryStore()
          console.log('  ✓ inventoryStore obtenido')
          inventoryStore.reset()
          console.log('  ✓ inventoryStore reseteado')
        } catch (err) {
          console.error('  ❌ Error en inventoryStore:', err)
        }

        try {
          const skillsStore = useSkillsStore()
          console.log('  ✓ skillsStore obtenido')
          skillsStore.reset()
          console.log('  ✓ skillsStore reseteado')
        } catch (err) {
          console.error('  ❌ Error en skillsStore:', err)
        }

        try {
          const marketStore = useMarketStore()
          console.log('  ✓ marketStore obtenido')
          marketStore.reset()
          console.log('  ✓ marketStore reseteado')
        } catch (err) {
          console.error('  ❌ Error en marketStore:', err)
        }

        try {
          const toolsStore = useToolsStore()
          console.log('  ✓ toolsStore obtenido')
          toolsStore.reset()
          console.log('  ✓ toolsStore reseteado')
        } catch (err) {
          console.error('  ❌ Error en toolsStore:', err)
        }

        console.log('✓ Todos los stores reseteados')

        // 4. Mostrar mensaje de éxito
        console.log('4️⃣ Mostrando notificación de éxito...')
        success(t('messages.success'), t('messages.clear_all_data_success'))

        // 5. Recargar la página forzando recarga completa desde servidor
        console.log('5️⃣ Recargando página...')
        setTimeout(() => {
          window.location.href = window.location.pathname + '?nocache=' + Date.now()
        }, 1500)
      } catch (err) {
        console.error('❌ Error general al eliminar datos:', err)
        console.error('Detalles del error:', {
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : 'No stack available',
        })
        error(t('messages.error'), t('messages.clear_all_data_error'))
      }
    },
  )
}
</script>

<style scoped>
.settings-view {
  margin-top: 25px;
  margin-bottom: 25px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  overflow: visible;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

h1 {
  color: var(--color-primary);
  margin: 0 0 32px 0;
  font-size: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  overflow-y: auto;
}

/* ============ SETTINGS SECTION ============ */
.settings-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  background: rgba(255, 165, 0, 0.05);
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-content {
  padding: 16px;
}

/* ============ LANGUAGE OPTIONS ============ */
.language-select {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-darker);
  border: 2px solid var(--color-primary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
  font-weight: 500;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffa500' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px;
}

.language-select:hover {
  border-color: var(--color-secondary);
  box-shadow: 0 0 8px rgba(255, 165, 0, 0.3);
}

.language-select:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 12px rgba(255, 165, 0, 0.4);
}

.language-select option {
  background: var(--bg-darker);
  color: var(--text-primary);
  padding: 10px;
}

/* ============ PLACEHOLDER ============ */
.placeholder {
  color: var(--text-secondary);
  margin: 0;
  font-size: 14px;
}

/* ============ DANGER SECTION ============ */
.danger-section {
  border: 2px solid var(--color-danger);
  background: rgba(255, 85, 85, 0.05);
}

.danger-section .section-header h2 {
  color: var(--color-danger);
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning-text {
  color: var(--color-warning);
  font-size: 12px;
  margin: 0 0 12px 0;
  padding: 8px 12px;
  background: rgba(255, 170, 85, 0.1);
  border-radius: 4px;
}

.btn-danger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-danger);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;
}

.btn-danger:hover {
  background: #ff4444;
  box-shadow: 0 0 12px rgba(255, 85, 85, 0.4);
  transform: scale(1.02);
}

.btn-danger:active {
  transform: scale(0.98);
}

/* ============ RESPONSIVE ============ */
@media (max-width: 768px) {
  .settings-view {
    padding: 16px;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 24px;
  }

  .section-header h2 {
    font-size: 16px;
  }

  .section-content {
    padding: 12px;
  }

  .language-option {
    padding: 10px;
    margin: 6px 0;
  }
}
</style>
