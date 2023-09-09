import { RouteRecordRaw } from 'vue-router';
import Login from './pages/Login.vue';
import Organizations from './pages/organizations/index.vue';
import NewOrganization from './pages/organizations/new.vue';

export const OrgRoute: RouteRecordRaw = {
  path: '/',
  name: 'Organizations',
  component: Organizations,
};
export const NewOrgRoute: RouteRecordRaw = {
  path: '/organizations/new',
  name: 'New Organization',
  component: NewOrganization,
  props: false,
};

export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: Login,
};
