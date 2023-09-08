import { defineStore } from 'pinia';
import { User } from '../models/User';

// get current user object from store
export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    currentUser: null as User | null,
  }),
  getters: {
    message: (piniaState) => {
      if (piniaState.currentUser) {
        return 'welcome';
      }

      return 'please log in';
    },
  },
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
