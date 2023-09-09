import { defineStore } from 'pinia';
import { User } from '../models/User';
import { OrganizationWithCreatorName as Organization } from '../models/Organization';

type UserWithPermissions = User & {
  permissions?: string[];
};
// get current user object from store
export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    currentUser: null as UserWithPermissions | null,
  }),
  actions: {
    setCurrentUser(user: UserWithPermissions) {
      /**
       * validations can be added here
       * to catch runtime errors.
       */
      this.currentUser = user;
    },

    setCurrentUserPermissions(permissions: string[]) {
      this.currentUser!.permissions = permissions;
    },

    clearCurrentUser() {
      this.currentUser = null;
    },
  },
});

// organization store
export const useOrganizationsStore = defineStore('organizations', {
  state: () => ({
    organizations: [] as Organization[],
  }),
  actions: {
    setOrganizations(orgs: Organization[]) {
      this.organizations = orgs;
    },
  },
});
