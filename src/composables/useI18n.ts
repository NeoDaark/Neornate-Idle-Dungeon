import { ref, computed } from 'vue'

// Importar idiomas
import es from '@/locales/es.json'
import en from '@/locales/en.json'

export type Locale = 'es' | 'en'

interface I18nStore {
  locale: Locale
  messages: Record<Locale, Record<string, any>>
}

// Estado global de i18n
const i18nState = ref<I18nStore>({
  locale: (localStorage.getItem('locale') as Locale) || 'es',
  messages: { es, en },
})

/**
 * Composable para usar traducciones
 * @example
 * const { t, locale, setLocale } = useI18n()
 * <h1>{{ t('ui.title') }}</h1>
 */
export function useI18n() {
  /**
   * Traducir clave con soporte para notación de punto
   * @param key - Clave de traducción ej: 'ui.menu.home'
   * @param defaultValue - Valor por defecto si no existe
   */
  const t = (key: string, defaultValue = key): string => {
    const keys = key.split('.')
    let current: any = i18nState.value.messages[i18nState.value.locale]

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        return defaultValue
      }
    }

    return typeof current === 'string' ? current : defaultValue
  }

  /**
   * Cambiar idioma y guardar en localStorage
   */
  const setLocale = (newLocale: Locale) => {
    i18nState.value.locale = newLocale
    localStorage.setItem('locale', newLocale)
  }

  /**
   * Obtener idioma actual
   */
  const locale = computed(() => i18nState.value.locale)

  return {
    t,
    locale,
    setLocale,
  }
}
