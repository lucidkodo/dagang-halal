import { defineStore } from 'pinia';
import { User } from '../models/User';
import { OrganizationWithCreatorName as Organization } from '../models/Organization';

// get current user object from store
export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    currentUser: null as User | null,
  }),
  actions: {
    setCurrentUser(user: User) {
      /**
       * validations can be added here
       * to catch runtime errors.
       */
      this.currentUser = user;
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
