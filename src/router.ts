import { createRouter, createWebHistory } from 'vue-router';
import { LoginRoute, OrgRoute, NewOrgRoute, OrgDetailsRoute } from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes: [LoginRoute, OrgRoute, NewOrgRoute, OrgDetailsRoute],
});

export default router;
