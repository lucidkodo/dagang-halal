<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { LoginRoute } from './routes';
import { useCurrentUserStore } from './store';
import { User } from '../models/User';
import Navbar from './components/Navbar.vue';

const router = useRouter();
const store = useCurrentUserStore();
const { currentUser } = storeToRefs(store);

const isLoggedIn = computed(() => {
  return currentUser.value !== null;
});

/**
 * Check for user data in local storage
 *
 * KIV:
 *
 * Function body can be simplified to one line:
 * return JSON.parse(localStorage.getItem('currentUser'))
 * (if i can figure out the type-gymnastic for this.)
 */
function getUserFromLocalStorage(): User | null {
  const localStorageUser = localStorage.getItem('currentUser');
  if (localStorageUser) {
    return JSON.parse(localStorageUser);
  }

  return null;
}

// redirect to login page if user data exists
const localStorageUser = getUserFromLocalStorage();
if (currentUser.value === null && localStorageUser === null) {
  router.push(LoginRoute);
}

// assign user to store
if (currentUser.value === null && localStorageUser) {
  store.setCurrentUser(localStorageUser);
}
</script>

<template>
  <Navbar v-if="isLoggedIn" />
  <Suspense>
    <router-view />
    <template #fallback>
      <i>Loading...</i>
    </template>
  </Suspense>
</template>
