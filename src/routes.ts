import { RouteRecordRaw } from 'vue-router';
import Login from './pages/Login.vue';
import Organizations from './pages/organizations/index.vue';

export const OrgRoute: RouteRecordRaw = {
  path: '/',
  name: 'Organizations',
  component: Organizations,
};

export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: Login,
};
