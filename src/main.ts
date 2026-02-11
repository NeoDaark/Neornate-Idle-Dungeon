import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

// Agregar todos los iconos sólidos y marcas a la librería
library.add(fas, fab)

const app = createApp(App)

// Registrar el componente FontAwesomeIcon globalmente
app.component('FaIcon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)
app.mount('#app')

console.log('✓ Neornate - Idle Dungeon iniciado')
console.log('✓ FontAwesome v6 configurado')
