<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../helpers/api';
import { User } from '../../models/User';

const router = useRouter();

// Ref: https://www.w3resource.com/javascript/form/email-validation.php
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const email = ref<string>('');
const password = ref<string>('');
const loginFailed = ref<boolean>(false);

async function onSubmit() {
  const user: User | null | undefined = await api.auth.login(
    email.value.toLowerCase(), // normalize email
    password.value
  );

  if (user) {
    router.push({ name: 'Organizations' });
  } else {
    loginFailed.value = true;
  }
}

function isEmailValid(input: string): boolean {
  return emailRegex.test(input);
}

function clearSubmitState() {
  if (loginFailed.value) {
    loginFailed.value = false;
  }
}
</script>

<template>
  <div :class="['q-pa-md', $style.formContainer]">
    <q-card class="card">
      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <div class="text-h5">Login</div>
          <div :class="$style.loginErrorMsg" v-if="loginFailed">
            Login failed. Please check your email & password again.
          </div>
          <div :class="$style.formField">
            <label for="email">Email</label>
            <q-input
              outlined
              type="email"
              v-model.trim="email"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter email',
                (val) => isEmailValid(val) || 'Please enter valid email',
              ]"
              :error="loginFailed"
              @update:model-value="clearSubmitState"
            >
              <template v-slot:append>
                <q-icon name="mail" color="grey" />
              </template>
            </q-input>
          </div>

          <div :class="$style.formField">
            <label for="password">Password</label>
            <q-input
              outlined
              type="password"
              v-model="password"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter password',
                (val) =>
                  val.length > 6 ||
                  'Password should be at least 6 characters long',
              ]"
              :error="loginFailed"
              @update:model-value="clearSubmitState"
            >
              <template v-slot:append>
                <q-icon name="lock" color="grey" />
              </template>
            </q-input>
          </div>
          <div class="text-center">
            <q-btn no-caps type="submit" color="green" :class="$style.loginBtn">
              Login
            </q-btn>
            <a :class="$style.forgetPassword">Forget password?</a>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" module>
.formContainer {
  max-width: 400px;
  margin: 0 auto;

  .loginErrorMsg {
    color: $negative;
  }

  .loginBtn {
    width: 100%;
    display: block;
    margin-bottom: 15px;
  }

  .forgetPassword {
    text-decoration: none;
    cursor: pointer;
    color: grey;

    &:hover,
    &:visited {
      color: inherit;
    }
  }

  .formField {
    label {
      color: grey;
    }
  }
}
</style>
