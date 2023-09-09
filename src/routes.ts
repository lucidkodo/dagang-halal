import { RouteRecordRaw } from 'vue-router';
import { useCurrentUserStore } from './store';
import Login from './pages/Login.vue';
import Organizations from './pages/organizations/index.vue';
import OrganizationDetails from './pages/organizations/Details.vue';

export const OrgRoute: RouteRecordRaw = {
  path: '/',
  name: 'Organizations',
  component: Organizations,
  meta: {
    /**
     * This array stores all the actions
     * that can be performed on the page.
     */
    pageActions: [
      'Organization.View',
      'Organization.Create',
      'Organization.Modify',
      'Organization.Delete',
    ] as string[],
  },
  /**
   * Capturing error message from route param values as props
   * so that it can be used on component level.
   */
  props: (route) => ({
    routeErrMsg: route.params.routeError,
  }),
  /**
   * Utilize the beforeEnter hook to check the store for sessions,
   * and redirect users when there's no session.
   */
  beforeEnter: (to, from, next) => {
    const store = useCurrentUserStore();
    if (store.currentUser === null) {
      next(LoginRoute);
      return; // so next() doesn't get called twice
    }

    next();
  },
};

export const OrgDetailsRoute: RouteRecordRaw = {
  path: '/organizations/:id',
  name: 'Organization Details',
  component: OrganizationDetails,
  beforeEnter: (to, from, next) => {
    const store = useCurrentUserStore();
    const canEdit = store.currentUser?.permissions?.includes(
      'Organization.Modify'
    );

    /**
     * Redirecting unauthorized users to homepage.
     * This implementation is immediate.
     *
     * The "fallback" route is set up to capture router params,
     * and on the component level, we can notify the user about the redirection.
     */
    if (!canEdit) {
      next({
        ...OrgRoute,
        params: {
          routeError: 'Not authorized', // error message can be standardized.
        },
      });
      return;
    }

    next();
  },
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
