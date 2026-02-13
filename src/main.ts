import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

console.log('🎮 [Main] Iniciando aplicación Neornate...')
console.log(`📁 BASE_URL: ${import.meta.env.BASE_URL}`)

// Agregar todos los iconos sólidos y marcas a la librería
library.add(fas, fab)
console.log('✓ [Main] FontAwesome configurado')

const app = createApp(App)
console.log('✓ [Main] App creada')

// Registrar el componente FontAwesomeIcon globalmente
app.component('FaIcon', FontAwesomeIcon)

console.log('✓ [Main] FaIcon registrado')

app.use(createPinia())
console.log('✓ [Main] Pinia inicializado')

app.use(router)
console.log('✓ [Main] Router inicializado')

app.mount('#app')
console.log('✓ [Main] App montada en #app')

console.log('✅ Neornate - Idle Dungeon iniciado correctamente')
