<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as dayjs from 'dayjs';
import api from '../../../helpers/api';
import { Organization } from '../../../models/Organization';
import { useCurrentUserStore, useOrganizationsStore } from '../../store';
import { LoginRoute, OrgRoute } from '../../routes';

const router = useRouter();
const currentUserStore = useCurrentUserStore();
const orgStore = useOrganizationsStore();

const name = ref<string>('');
const businessRegNum = ref<string>('');
const address = ref<string>('');
const postcode = ref<string>('');
const contactNum = ref<string>('010-1112223');

function hasValue(input: string): boolean {
  return input !== null && input.length > 0;
}

async function onSubmit() {
  const newOrg: Organization = {
    id: new Date().getTime(), // use ms since epoch
    createBy: currentUserStore.currentUser!.id,
    name: name.value,
    businessRegNum: businessRegNum.value,
    address: address.value,
    postcode: postcode.value,
    contactNum: contactNum.value,
    createTimestamp: dayjs().toISOString(),
  };

  const createdOrg = await api.organization.create(newOrg);

  // "clone" and update store with new organization
  const organizations = [...orgStore.organizations];
  organizations.push({
    ...createdOrg,
    creatorName: `${currentUserStore.currentUser!.firstName} ${
      currentUserStore.currentUser!.lastName
    }`,
  });

  orgStore.setOrganizations(organizations);
  router.push(OrgRoute);
}

/**
 * Assuming the organization is tied to creator,
 * redirect when user is not logged in.
 */
if (currentUserStore.currentUser === null) {
  router.push(LoginRoute);
}
</script>

<template>
  <div class="q-pa-md">
    <q-card class="card">
      <q-card-section>
        <div class="text-h5">New organization</div>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            outlined
            v-model.trim="name"
            label="Organization name"
            lazy-rules
            :rules="[
              (val) => hasValue(val) || 'Organization name cannot be empty',
            ]"
          />
          <q-input
            outlined
            v-model.trim="businessRegNum"
            label="Business registration number"
            lazy-rules
            :rules="[
              (val) =>
                hasValue(val) || 'Business registration number cannot be empty',
            ]"
          />
          <q-input
            outlined
            v-model.trim="address"
            label="Address"
            lazy-rules
            :rules="[(val) => hasValue(val) || 'Address cannot be empty']"
          />
          <q-input
            outlined
            v-model.trim="postcode"
            label="Postcode"
            lazy-rules
            :rules="[(val) => hasValue(val) || 'Postcode cannot be empty']"
          />
          <q-input
            outlined
            v-model.trim="contactNum"
            label="Mobile number"
            pattern="^(\+?6?01)[0-46-9]-*[0-9]{7,8}$"
            hint="01x-1234567 or 601x-1234567"
            lazy-rules
            :rules="[
              (val) => hasValue(val) || 'Contact number cannot be empty',
            ]"
          />
          <div>
            <q-btn
              class="full-width"
              label="Submit"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
<style lang="scss" scoped>
.card {
  max-width: 400px;
  margin: 0 auto;
}
</style>
