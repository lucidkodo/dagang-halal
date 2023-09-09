import { RouteRecordRaw } from 'vue-router';
import Login from './pages/Login.vue';
import Organizations from './pages/organizations/index.vue';
import OrganizationDetails from './pages/organizations/Details.vue';

export const OrgRoute: RouteRecordRaw = {
  path: '/',
  name: 'Organizations',
  component: Organizations,
};

export const OrgDetailsRoute: RouteRecordRaw = {
  path: '/organizations/:id',
  name: 'Organization Details',
  component: OrganizationDetails,
  props: true,
};

export const NewOrgRoute: RouteRecordRaw = {
  path: '/organizations/new',
  name: 'New Organization',
  component: OrganizationDetails,
  props: false,
};

export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: Login,
};
