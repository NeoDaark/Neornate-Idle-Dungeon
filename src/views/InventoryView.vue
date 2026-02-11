<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useInventoryStore } from '@/stores/inventoryStore'
import { ItemType, EquipmentSlot } from '@/types/Game'
import ItemGrid from '@/components/inventory/ItemGrid.vue'

const { t } = useI18n()
const router = useRouter()
const inventoryStore = useInventoryStore()

// Estado local
const selectedTab = ref<'all' | 'resources' | 'materials' | 'consumables'>('all')
const searchQuery = ref('')

// Computed: Items filtrados
const filteredItems = computed(() => {
  let items = inventoryStore.inventory.items

  // Filtrar por tipo
  if (selectedTab.value !== 'all') {
    const typeMap: Record<string, ItemType> = {
      'resources': ItemType.RESOURCE,
      'materials': ItemType.MATERIAL,
      'consumables': ItemType.CONSUMABLE,
    }
    items = items.filter(stack => stack.item.type === typeMap[selectedTab.value])
  }

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(stack =>
      stack.item.id.toLowerCase().includes(query) ||
      t(`items.${stack.item.id}`).toLowerCase().includes(query)
    )
  }

  return items
})

// Oro formateado
const goldFormatted = computed(() => {
  return inventoryStore.inventory.gold.toLocaleString()
})

// Total de slots
const slotsUsed = computed(() => inventoryStore.totalSlots)
const slotsMax = computed(() => 50) // TODO: Basado en stats del jugador

// Porcentaje de capacidad
const capacityPercent = computed(() => {
  return Math.round((slotsUsed.value / slotsMax.value) * 100)
})

// Abrir equipamiento
const openEquipment = () => {
  router.push({ name: 'equipment' })
}
</script>

<template>
  <div class="inventory-view">
    <!-- Header Compacto -->
    <div class="inventory-header">
      <div class="header-info">
        <h1>{{ t('ui.menu.inventory') }}</h1>
        <div class="header-stats-group">
          <button 
            class="equipment-btn"
            @click="openEquipment"
            :title="t('labels.equipment')"
          >
            <FaIcon icon="fa-solid fa-shirt" />
          </button>
          <div class="header-stats">
            <div class="stat gold-stat">
              <span class="icon">💰</span>
              <span class="value">{{ goldFormatted }}</span>
            </div>
            <div class="stat capacity-stat">
              <span class="icon">📦</span>
              <span class="value">{{ slotsUsed }}/{{ slotsMax }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="capacity-bar">
        <div class="capacity-fill" :style="{ width: capacityPercent + '%' }"></div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="inventory-content">
      <!-- Inventario de Items (PRIMERO) -->
      <section class="items-section">
        <div class="items-header">
          <!-- Búsqueda -->
          <div class="search-bar">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('ui.search_items')"
              class="search-input"
            />
          </div>
        </div>

        <!-- Tabs de filtrado -->
        <div class="filter-tabs">
          <button
            v-for="tab in ['all', 'resources', 'materials', 'consumables']"
            :key="tab"
            class="tab-button"
            :class="{ active: selectedTab === tab as any }"
            @click="selectedTab = tab as any"
          >
            {{ t(`labels.filter_${tab}`) }}
          </button>
        </div>

        <!-- Grid de Items -->
        <ItemGrid
          :items="filteredItems"
          @unequip-item="(slot: string) => inventoryStore.unequipItem(slot as EquipmentSlot)"
        />

        <!-- Mensaje si está vacío -->
        <div v-if="filteredItems.length === 0" class="empty-state">
          <p>{{ t('ui.inventory_empty') }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.inventory-view {
  margin-top: 25px;
  margin-bottom: 25px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  overflow: visible;
  background: var(--bg-dark);
  gap: 0;
}

/* ===== HEADER ===== */
.inventory-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.header-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.header-stats-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inventory-header h1 {
  margin: 0;
  font-size: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.header-stats {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(255, 165, 0, 0.08);
  border: 1px solid rgba(255, 165, 0, 0.2);
  border-radius: 4px;
  font-size: 13px;
}

.stat .icon {
  font-size: 14px;
}

.stat .value {
  color: var(--color-primary);
  font-weight: 600;
}
.capacity-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 165, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-success), var(--color-warning));
  transition: width 0.3s ease;
}

/* ===== CONTENIDO ===== */
.inventory-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

section h2 {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===== EQUIPMENT SECTION ===== */
.equipment-section {
  flex-shrink: 0;
}

/* ===== ITEMS SECTION ===== */
.items-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.items-header h2 {
  margin: 0;
  flex-shrink: 0;
}

.search-bar {
  flex: 1;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.search-input::placeholder {
  color: var(--text-muted);
}

/* ===== FILTER TABS ===== */
.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 8px 16px;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.tab-button:hover {
  border-color: var(--color-primary);
  color: var(--text-primary);
}

.tab-button.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #000;
}

/* ===== EQUIPMENT BUTTON ===== */
.equipment-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: rgba(255, 165, 0, 0.12);
  border: 1.5px solid var(--color-primary);
  border-radius: 4px;
  color: var(--color-primary);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.equipment-btn:hover {
  background: rgba(255, 165, 0, 0.2);
  border-color: var(--color-secondary);
  box-shadow: 0 0 8px rgba(255, 165, 0, 0.15);
}

.equipment-btn:active {
  transform: scale(0.95);
}

/* ===== EMPTY STATE ===== */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 16px;
  text-align: center;
  padding: 40px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .inventory-content {
    padding: 16px;
    gap: 24px;
  }

  .header-stats {
    grid-template-columns: 1fr;
  }

  .items-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-bar {
    width: 100%;
    max-width: none;
  }

  .filter-tabs {
    gap: 6px;
  }

  .tab-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
