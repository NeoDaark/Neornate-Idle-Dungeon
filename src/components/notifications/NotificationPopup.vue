<template>
  <div v-if="isVisible" class="notification-wrapper" @click="close">
    <div class="notification-popup" :class="[type, `size-${size}`]" @click.stop>
      <div class="notification-header">
        <div class="notification-icon">
          <FaIcon :icon="getIcon()" />
        </div>
        <h3 class="notification-title">{{ title }}</h3>
        <button class="notification-close" @click="close">
          <FaIcon icon="fa-solid fa-xmark" />
        </button>
      </div>

      <div class="notification-content">
        <p>{{ message }}</p>
      </div>

      <div v-if="showButtons" class="notification-buttons">
        <button v-if="showCancel" class="btn-secondary" @click="onCancel">
          {{ cancelText }}
        </button>
        <button class="btn-primary" :class="type" @click="onConfirm">
          {{ confirmText }}
        </button>
      </div>

      <div v-if="autoClose" class="notification-progress">
        <div class="progress-bar" :style="{ animationDuration: `${duration}ms` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import FaIcon from '@/components/dev/FaIcon.vue'

type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'confirm'
type NotificationSize = 'small' | 'medium' | 'large'

interface Props {
  type?: NotificationType
  title: string
  message: string
  duration?: number
  autoClose?: boolean
  showButtons?: boolean
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
  size?: NotificationSize
}

interface Emits {
  confirm: []
  cancel: []
  close: []
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
  autoClose: true,
  showButtons: false,
  showCancel: false,
  confirmText: 'Aceptar',
  cancelText: 'Cancelar',
  size: 'medium',
})

const emit = defineEmits<Emits>()

const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
  if (props.autoClose) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})

const getIcon = computed(() => {
  return () => {
    switch (props.type) {
      case 'success':
        return 'fa-solid fa-check-circle'
      case 'error':
        return 'fa-solid fa-exclamation-circle'
      case 'warning':
        return 'fa-solid fa-triangle-exclamation'
      case 'confirm':
        return 'fa-solid fa-question-circle'
      default:
        return 'fa-solid fa-info-circle'
    }
  }
})

const close = () => {
  isVisible.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

const onConfirm = () => {
  emit('confirm')
  close()
}

const onCancel = () => {
  emit('cancel')
  close()
}
</script>

<style scoped>
.notification-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.notification-popup {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
  max-width: 90vw;
  min-width: 300px;
  user-select: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============ SIZES ============ */
.size-small {
  width: 320px;
}

.size-medium {
  width: 450px;
}

.size-large {
  width: 600px;
}

/* ============ TYPES ============ */
.success {
  border-left: 4px solid var(--color-success);
}

.success .notification-icon {
  color: var(--color-success);
}

.error {
  border-left: 4px solid var(--color-danger);
}

.error .notification-icon {
  color: var(--color-danger);
}

.warning {
  border-left: 4px solid var(--color-warning);
}

.warning .notification-icon {
  color: var(--color-warning);
}

.info {
  border-left: 4px solid var(--color-primary);
}

.info .notification-icon {
  color: var(--color-primary);
}

.confirm {
  border-left: 4px solid var(--color-primary);
}

.confirm .notification-icon {
  color: var(--color-primary);
}

/* ============ HEADER ============ */
.notification-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.notification-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.notification-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}

.notification-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.notification-close:hover {
  color: var(--text-primary);
}

/* ============ CONTENT ============ */
.notification-content {
  padding: 16px 20px;
  color: var(--text-secondary);
}

.notification-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* ============ BUTTONS ============ */
.notification-buttons {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-secondary {
  background: var(--bg-darker);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--border-color);
  border-color: var(--text-secondary);
}

.btn-primary {
  color: #fff;
}

.btn-primary.success {
  background: var(--color-success);
}

.btn-primary.success:hover {
  background: #44dd44;
}

.btn-primary.error {
  background: var(--color-danger);
}

.btn-primary.error:hover {
  background: #ff4444;
}

.btn-primary.warning {
  background: var(--color-warning);
}

.btn-primary.warning:hover {
  background: #ffbb66;
}

.btn-primary.info,
.btn-primary.confirm {
  background: var(--color-primary);
}

.btn-primary.info:hover,
.btn-primary.confirm:hover {
  background: #ffb84d;
}

/* ============ PROGRESS BAR ============ */
.notification-progress {
  height: 3px;
  background: var(--border-color);
  overflow: hidden;
  border-radius: 0 0 12px 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  animation: progress linear forwards;
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* ============ RESPONSIVE ============ */
@media (max-width: 480px) {
  .notification-popup {
    min-width: 250px;
    width: 95vw;
  }

  .size-small,
  .size-medium,
  .size-large {
    width: 95vw;
  }

  .notification-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
