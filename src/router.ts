import { createRouter, createWebHistory } from 'vue-router';
import { LoginRoute, OrgRoute } from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes: [LoginRoute, OrgRoute],
});

export default router;
