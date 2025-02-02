// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Index from '../pages/index.vue'
import Test from '../pages/test.vue'

const routes = [
  {
    path: '/',
    name: 'Playgroud',
    component: Index
  },
  {
    path: '/test',
    name: 'Happy New Year',
    component: Test
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router