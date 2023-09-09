import { createRouter, createWebHistory } from 'vue-router';
import { LoginRoute, OrgRoute, NewOrgRoute } from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes: [LoginRoute, OrgRoute, NewOrgRoute],
});

export default router;
