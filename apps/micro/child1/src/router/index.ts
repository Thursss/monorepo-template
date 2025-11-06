import {
  createRouter,
  createWebHistory,
} from 'vue-router'

export default createRouter({
  history: createWebHistory('/child/vue3'),
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
