<script setup lang="ts">
import { computed } from 'vue'
import { calculateXpForLevel } from '@/types/Game'
import { Skill, Tier } from '@/types/Game'
import { SKILL_CONFIGS } from '@/types/Game'
import { MINING_PRODUCTS } from '@/data/skillProducts/mining'
import { LOGGING_PRODUCTS } from '@/data/skillProducts/logging'
import { SMELTING_PRODUCTS } from '@/data/skillProducts/smelting'

// Mapeo de skills a productos
const skillProducts: Record<string, Record<string, any>> = {
  [Skill.MINERIA]: MINING_PRODUCTS,
  [Skill.TALA]: LOGGING_PRODUCTS,
  [Skill.FUNDICION]: SMELTING_PRODUCTS,
}

// Tiers y sus rangos de nivel
const tiers = [
  { name: 'T1', levelRange: [1, 20] },
  { name: 'T2', levelRange: [20, 40] },
  { name: 'T3', levelRange: [40, 60] },
  { name: 'T4', levelRange: [60, 80] },
  { name: 'T5', levelRange: [80, 100] },
  { name: 'T6', levelRange: [100, 120] },
  { name: 'T7', levelRange: [120, 200] },
]

// Calcular curva de XP para todos los niveles
const xpCurve = computed(() => {
  const curve = []
  for (let level = 1; level <= 200; level++) {
    curve.push({
      level,
      xpRequired: calculateXpForLevel(level),
    })
  }
  return curve
})

// Análisis por tier
const tierAnalysis = computed(() => {
  return tiers.map(tier => {
    let totalXp = 0
    let minXp = Infinity
    let maxXp = 0
    const levelCount = tier.levelRange[1] - tier.levelRange[0]

    for (let level = tier.levelRange[0]; level < tier.levelRange[1]; level++) {
      const xp = calculateXpForLevel(level + 1)
      totalXp += xp
      minXp = Math.min(minXp, xp)
      maxXp = Math.max(maxXp, xp)
    }

    const avgXp = totalXp / levelCount
    
    return {
      tier: tier.name,
      levelRange: `${tier.levelRange[0]}-${tier.levelRange[1]}`,
      totalXp,
      minXp,
      avgXp: Math.round(avgXp),
      maxXp,
      levelCount,
    }
  })
})

// Análisis por skill y producto
const skillAnalysis = computed(() => {
  const analysis: any[] = []

  for (const [skillKey, products] of Object.entries(skillProducts)) {
    const productList = Object.values(products) as any[]
    
    // Obtener TODOS los productos por tier (no solo el primero)
    const productsByTier: Record<string, any[]> = {}
    for (const product of productList) {
      const tierStr = product.tier
      if (!productsByTier[tierStr]) {
        productsByTier[tierStr] = []
      }
      productsByTier[tierStr].push(product)
    }

    // Calcular tiempo por tier con CADA producto
    const tierBreakdown: any[] = []
    
    for (const tier of tiers) {
      let tierXp = 0
      const tierTierStr = tier.name
      const productsInTier = productsByTier[tierTierStr] || []
      
      // Calcular XP total para este tier
      for (let level = tier.levelRange[0]; level < tier.levelRange[1]; level++) {
        tierXp += calculateXpForLevel(level + 1)
      }

      // Crear una fila por cada producto en este tier
      for (const product of productsInTier) {
        const xpPerCycle = product.xpReward
        const cyclesNeeded = tierXp / xpPerCycle
        const secondsNeeded = cyclesNeeded * 5
        const hoursNeeded = secondsNeeded / 3600
        const daysNeeded = hoursNeeded / 24

        tierBreakdown.push({
          tier: tier.name,
          product: product.name,
          xpPerCycle,
          cyclesNeeded: Math.round(cyclesNeeded),
          hoursNeeded: hoursNeeded.toFixed(1),
          daysNeeded: daysNeeded.toFixed(2),
        })
      }
      
      // Si no hay productos en este tier, mostrar N/A
      if (productsInTier.length === 0) {
        tierBreakdown.push({
          tier: tier.name,
          product: 'N/A',
          xpPerCycle: 0,
          cyclesNeeded: 0,
          hoursNeeded: 0,
          daysNeeded: 0,
        })
      }
    }

    // Calcular tiempo total a nivel 200
    const totalXp = tiers.reduce((sum, tier) => {
      let tierXp = 0
      for (let level = tier.levelRange[0]; level < tier.levelRange[1]; level++) {
        tierXp += calculateXpForLevel(level + 1)
      }
      return sum + tierXp
    }, 0)

    // Usar el producto con MENOR XP de T7 (peor caso = tiempo máximo)
    const t7Products = productList.filter(p => p.tier === Tier.T7)
    const worstT7Product = t7Products.length > 0 
      ? t7Products.reduce((min, p) => p.xpReward < min.xpReward ? p : min)
      : productList[productList.length - 1]

    const totalCycles = totalXp / worstT7Product.xpReward
    const totalHours = (totalCycles * 5) / 3600
    const totalDays = totalHours / 24

    analysis.push({
      skill: skillKey,
      emoji: SKILL_CONFIGS[skillKey as Skill].emoji,
      tierBreakdown,
      totalTime: {
        cycles: Math.round(totalCycles),
        hours: totalHours.toFixed(1),
        days: totalDays.toFixed(1),
      },
    })
  }

  return analysis
})

// Calcular XP total acumulado hasta nivel 200
const totalXpToLevel200 = computed(() => {
  let total = 0
  for (let level = 1; level < 200; level++) {
    total += calculateXpForLevel(level + 1)
  }
  return total
})
</script>

<template>
  <div class="dev-view">
    <div class="header">
      <h1>🛠️ Dev View: Curva de XP y Progresión</h1>
      <p class="subtitle">Análisis completo de progresión por skill y tier</p>
    </div>

    <!-- Resumen Global -->
    <section class="section">
      <h2>📊 Resumen Global</h2>
      <div class="summary-grid">
        <div class="summary-card">
          <p class="label">XP Total a Nivel 200</p>
          <p class="value">{{ totalXpToLevel200.toLocaleString() }}</p>
        </div>
        <div class="summary-card">
          <p class="label">Niveles Máximos</p>
          <p class="value">200</p>
        </div>
        <div class="summary-card">
          <p class="label">Ciclos por Skill (T7 Óptimo)</p>
          <p class="value">~{{ (totalXpToLevel200 / 400).toLocaleString() }}</p>
        </div>
        <div class="summary-card">
          <p class="label">Tiempo Total (T7 Óptimo)</p>
          <p class="value">~{{ (totalXpToLevel200 / 400 * 5 / 3600 / 24).toFixed(1) }} días</p>
        </div>
      </div>
    </section>

    <!-- Análisis por Tier -->
    <section class="section">
      <h2>📈 Análisis por Tier</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tier</th>
            <th>Rango de Niveles</th>
            <th>Niveles</th>
            <th>XP Total</th>
            <th>XP/Nivel (Min)</th>
            <th>XP/Nivel (Promedio)</th>
            <th>XP/Nivel (Máx)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tier in tierAnalysis" :key="tier.tier" :class="tier.tier.toLowerCase()">
            <td class="tier-badge">{{ tier.tier }}</td>
            <td>{{ tier.levelRange }}</td>
            <td>{{ tier.levelCount }}</td>
            <td class="number">{{ tier.totalXp.toLocaleString() }}</td>
            <td class="number">{{ tier.minXp.toLocaleString() }}</td>
            <td class="number">{{ tier.avgXp.toLocaleString() }}</td>
            <td class="number">{{ tier.maxXp.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Análisis por Skill -->
    <section class="section" v-for="skill in skillAnalysis" :key="skill.skill">
      <div class="skill-header">
        <h2>{{ skill.emoji }} Skill: {{ skill.skill }}</h2>
        <div class="skill-summary">
          <span>Total: {{ skill.totalTime.days }} días</span>
          <span>({{ skill.totalTime.hours }} horas)</span>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Tier</th>
            <th>Producto</th>
            <th>XP/Ciclo</th>
            <th>Ciclos Necesarios</th>
            <th>Horas</th>
            <th>Días</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="breakdown in skill.tierBreakdown" :key="breakdown.tier" :class="breakdown.tier.toLowerCase()">
            <td class="tier-badge">{{ breakdown.tier }}</td>
            <td class="product-name">{{ breakdown.product }}</td>
            <td class="number">{{ breakdown.xpPerCycle }}</td>
            <td class="number">{{ breakdown.cyclesNeeded.toLocaleString() }}</td>
            <td class="number">{{ breakdown.hoursNeeded }}</td>
            <td class="number">{{ breakdown.daysNeeded }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Tabla Completa de XP por Nivel -->
    <section class="section">
      <h2>📋 Tabla Completa: XP por Nivel</h2>
      <div class="table-scroll">
        <table class="data-table tiny">
          <thead>
            <tr>
              <th>Nivel</th>
              <th>XP Requerido</th>
              <th>Ciclos (400 XP)</th>
              <th>Nivel</th>
              <th>XP Requerido</th>
              <th>Ciclos (400 XP)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 100" :key="i">
              <td class="number">{{ i }}</td>
              <td class="number">{{ xpCurve[i - 1]?.xpRequired.toLocaleString() || '-' }}</td>
              <td class="number">{{ Math.round((xpCurve[i - 1]?.xpRequired || 0) / 400) }}</td>
              <td class="number">{{ i + 100 }}</td>
              <td class="number">{{ xpCurve[i + 99]?.xpRequired.toLocaleString() || '-' }}</td>
              <td class="number">{{ Math.round((xpCurve[i + 99]?.xpRequired || 0) / 400) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Info -->
    <section class="section info">
      <h3>ℹ️ Información</h3>
      <ul>
        <li>Base XP: 100 + (nivel × 50)</li>
        <li>T1-T6: Multiplicadores 2.0x → 4.0x → 8.0x → 16.0x → 32.0x → 64.0x</li>
        <li>T7: Escalado dinámico 128 + (nivel-121)×0.4 (Bloqueado para expansión futura)</li>
        <li>Ciclo estándar: 5 segundos</li>
        <li>XP Rewards de materiales: REDUCIDOS A LA MITAD (balance estratégico)</li>
        <li>Progresión esperada: 25-35 días de farmeo continuo T1-T6</li>
        <li>Requiere planificación estratégica entre skills</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.dev-view {
  padding: 20px;
  background: var(--bg-dark);
  color: var(--text-primary);
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 30px;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 15px;
}

.header h1 {
  margin: 0 0 10px 0;
  color: var(--color-primary);
  font-size: 2em;
}

.subtitle {
  color: var(--text-secondary);
  margin: 0;
}

.section {
  margin-bottom: 40px;
  background: var(--bg-card);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.section h2 {
  margin-top: 0;
  color: var(--color-primary);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.summary-card {
  background: var(--bg-darker);
  padding: 15px;
  border-radius: 6px;
  border-left: 3px solid var(--color-primary);
}

.summary-card .label {
  font-size: 0.85em;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
}

.summary-card .value {
  font-size: 1.5em;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.skill-header h2 {
  margin: 0;
  border: none;
  padding: 0;
}

.skill-summary {
  background: var(--bg-darker);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9em;
  color: var(--text-secondary);
}

.skill-summary span {
  margin-right: 15px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  font-size: 0.9em;
}

.data-table thead {
  background: var(--bg-darker);
  border-bottom: 2px solid var(--border-color);
}

.data-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: var(--color-primary);
  border-right: 1px solid var(--border-color);
}

.data-table th:last-child {
  border-right: none;
}

.data-table td {
  padding: 10px 12px;
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.data-table td:last-child {
  border-right: none;
}

.data-table tbody tr:hover {
  background: var(--bg-darker);
}

.data-table tbody tr.t1,
.data-table tbody tr.t2 {
  color: #55ff55;
}

.data-table tbody tr.t3,
.data-table tbody tr.t4 {
  color: #ffff55;
}

.data-table tbody tr.t5,
.data-table tbody tr.t6 {
  color: #ff8855;
}

.data-table tbody tr.t7 {
  color: #ff55ff;
  font-weight: 600;
}

.tier-badge {
  font-weight: bold;
  min-width: 40px;
}

.number {
  text-align: right;
  font-family: monospace;
}

.product-name {
  font-style: italic;
  color: var(--text-secondary);
}

.table-scroll {
  overflow-x: auto;
  margin-top: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.data-table.tiny {
  font-size: 0.8em;
}

.data-table.tiny td,
.data-table.tiny th {
  padding: 6px 8px;
}

.info {
  background: var(--bg-darker);
  border-left: 4px solid var(--color-success);
}

.info h3 {
  margin-top: 0;
  color: var(--color-success);
}

.info ul {
  margin: 0;
  padding-left: 20px;
}

.info li {
  margin: 5px 0;
  color: var(--text-secondary);
}
</style>
