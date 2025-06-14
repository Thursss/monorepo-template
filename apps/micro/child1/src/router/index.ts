import {
  createRouter,
  createWebHistory,
} from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../pages/Home.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../pages/404.vue'),
    },
  ],
})
