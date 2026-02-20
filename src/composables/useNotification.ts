import { ref } from 'vue'

type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'confirm'
type NotificationSize = 'small' | 'medium' | 'large'

interface NotificationOptions {
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
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

// Guardamos las notificaciones activas
const activeNotifications = ref<Array<NotificationOptions & { id: string }>>([])

let notificationId = 0

export function useNotification() {
  /**
   * Mostrar una notificación
   */
  const show = (options: NotificationOptions) => {
    const id = String(notificationId++)
    const notification = { ...options, id }

    activeNotifications.value.push(notification)

    return {
      close: () => {
        const index = activeNotifications.value.findIndex((n) => n.id === id)
        if (index > -1) {
          activeNotifications.value.splice(index, 1)
        }
      },
    }
  }

  /**
   * Mostrar notificación de éxito
   */
  const success = (title: string, message: string, duration = 3000) => {
    return show({
      type: 'success',
      title,
      message,
      duration,
      autoClose: true,
      showButtons: false,
    })
  }

  /**
   * Mostrar notificación de error
   */
  const error = (title: string, message: string, duration = 5000) => {
    return show({
      type: 'error',
      title,
      message,
      duration,
      autoClose: true,
      showButtons: false,
    })
  }

  /**
   * Mostrar notificación de advertencia
   */
  const warning = (title: string, message: string, duration = 4000) => {
    return show({
      type: 'warning',
      title,
      message,
      duration,
      autoClose: true,
      showButtons: false,
    })
  }

  /**
   * Mostrar notificación de información
   */
  const info = (title: string, message: string, duration = 3000) => {
    return show({
      type: 'info',
      title,
      message,
      duration,
      autoClose: true,
      showButtons: false,
    })
  }

  /**
   * Mostrar notificación de confirmación (con botones)
   */
  const confirm = async (
    title: string,
    message: string,
    onConfirm?: () => void | Promise<void>,
    onCancel?: () => void,
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      show({
        type: 'confirm',
        title,
        message,
        duration: 0,
        autoClose: false,
        showButtons: true,
        showCancel: true,
        confirmText: 'Aceptar',
        cancelText: 'Cancelar',
        onConfirm: async () => {
          if (onConfirm) {
            await onConfirm()
          }
          resolve(true)
        },
        onCancel: () => {
          if (onCancel) {
            onCancel()
          }
          resolve(false)
        },
      })
    })
  }

  return {
    activeNotifications,
    show,
    success,
    error,
    warning,
    info,
    confirm,
  }
}
