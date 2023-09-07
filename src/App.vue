<script setup lang="ts">
import { useRouter } from 'vue-router';
import { LoginRoute } from './routes';
import { useCurrentUserStore } from './store';

const router = useRouter();
const store = useCurrentUserStore();

if (store.currentUser === null) {
  router.push(LoginRoute);
}
</script>

<template>
  <router-view />
</template>
