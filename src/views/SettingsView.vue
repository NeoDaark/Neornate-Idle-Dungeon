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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n, type Locale } from '@/composables/useI18n'

const { t, locale, setLocale } = useI18n()
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
