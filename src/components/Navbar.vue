<script setup lang="ts">
import { computed } from 'vue';
import { useCurrentUserStore } from '../store';
import { useRouter } from 'vue-router';
import { LoginRoute } from '../routes';

const store = useCurrentUserStore();
const router = useRouter();
const pageTitle = computed(() => {
  return router.currentRoute.value.name;
});

function logout() {
  localStorage.clear();
  store.clearCurrentUser();
  router.push(LoginRoute);
}
</script>

<template>
  <nav>
    <div class="text-h5">{{ pageTitle || 'Page' }}</div>
    <ul>
      <li>
        <router-link :to="'/'">Organizations</router-link>
      </li>
    </ul>
    <div class="btnControl">
      <q-btn no-caps color="green">
        <span class="addBtn">&#43;</span>
        Add organization
      </q-btn>
      <q-btn no-caps color="grey" @click="logout">Logout</q-btn>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  width: 100%;
  padding: 15px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

  ul {
    padding: 0;
    margin: 0;

    li {
      display: inline-block;

      & + li {
        margin-left: 15px;
      }

      a,
      a:visited,
      a:hover {
        color: darkblue;
        text-decoration: none;
      }
      .router-link-exact-active {
        color: inherit;
        text-decoration: underline;
      }
    }
  }

  .btnControl {
    button + button {
      margin-left: 15px;
    }

    button {
      .addBtn {
        font-weight: bold;
        margin-right: 8px;
      }
    }
  }
}
</style>
