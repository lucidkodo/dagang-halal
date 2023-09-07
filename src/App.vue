<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCurrentUserStore } from './store';

const router = useRouter();
const store = useCurrentUserStore();

if (store.currentUser === null) {
  router.push({ name: 'Login' });
}
</script>

<template>
  <router-view />
</template>
