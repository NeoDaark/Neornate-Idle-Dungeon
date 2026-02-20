<template>
  <Teleport to="body">
    <div class="notifications-container" :class="{ active: activeNotifications.length > 0 }">
      <TransitionGroup name="notification" tag="div">
        <NotificationPopup
          v-for="notification in activeNotifications"
          :key="notification.id"
          :type="notification.type"
          :title="notification.title"
          :message="notification.message"
          :duration="notification.duration"
          :auto-close="notification.autoClose"
          :show-buttons="notification.showButtons"
          :show-cancel="notification.showCancel"
          :confirm-text="notification.confirmText"
          :cancel-text="notification.cancelText"
          :size="notification.size"
          @confirm="
            () => {
              if (notification.onConfirm) notification.onConfirm()
              removeNotification(notification.id)
            }
          "
          @cancel="
            () => {
              if (notification.onCancel) notification.onCancel()
              removeNotification(notification.id)
            }
          "
          @close="removeNotification(notification.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'
import NotificationPopup from './NotificationPopup.vue'

const { activeNotifications } = useNotification()

const removeNotification = (id: string) => {
  const index = activeNotifications.value.findIndex((n) => n.id === id)
  if (index > -1) {
    activeNotifications.value.splice(index, 1)
  }
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;
}

.notifications-container.active {
  pointer-events: auto;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
