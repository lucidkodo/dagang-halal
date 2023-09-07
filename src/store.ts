import { defineStore } from 'pinia';
import { User } from '../models/User';

const currentUser: User | null = null;

// get current user object from store
export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    currentUser,
  }),
  getters: {
    message: (piniaState) => {
      if (piniaState.currentUser) {
        return 'welcome';
      }

      return 'please log in';
    },
  },
});
