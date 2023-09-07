import { createRouter, createWebHistory } from 'vue-router';
import Login from './pages/Login.vue';
import Organizations from './pages/organizations/index.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Organizations',
      component: Organizations,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
  ],
});

export default router;
