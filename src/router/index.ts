import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/loading',
    name: 'loading',
    component: () => import('@/views/LoadingView.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/skills',
    name: 'skills',
    component: () => import('@/views/SkillsView.vue'),
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('@/views/InventoryView.vue'),
  },
  {
    path: '/equipment',
    name: 'equipment',
    component: () => import('@/views/EquipmentView.vue'),
  },
  {
    path: '/dungeon',
    name: 'dungeon',
    component: () => import('@/views/DungeonView.vue'),
  },
  {
    path: '/market',
    name: 'market',
    component: () => import('@/views/MarketView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
  },
  // Catchall para rutas no encontradas - redirige a home
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Restaurar ruta si fue redirigida por 404.html (GitHub Pages)
router.beforeEach((to, _from, next) => {
  const redirectPath = sessionStorage.getItem('redirect')
  if (redirectPath && to.path === '/') {
    sessionStorage.removeItem('redirect')
    // Parsear la ruta original (remover el base URL)
    const baseUrl = import.meta.env.BASE_URL
    const routePath = redirectPath.replace(baseUrl, '').split('?')[0]
    if (routePath && routePath !== '/') {
      next(routePath)
      return
    }
  }
  next()
})

export default router
