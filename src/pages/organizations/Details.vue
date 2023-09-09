<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as dayjs from 'dayjs';
import api from '../../../helpers/api';
import { Organization } from '../../../models/Organization';
import { useCurrentUserStore, useOrganizationsStore } from '../../store';
import { LoginRoute, OrgRoute } from '../../routes';

type FormData = Pick<
  Organization,
  'name' | 'businessRegNum' | 'address' | 'postcode' | 'contactNum'
>;

const router = useRouter();
const currentUserStore = useCurrentUserStore();
const orgStore = useOrganizationsStore();

const { id } = router.currentRoute.value.params;

const name = ref<string>('');
const businessRegNum = ref<string>('');
const address = ref<string>('');
const postcode = ref<string>('');
const contactNum = ref<string>('010-1112223');

const path = computed(() => {
  const { path } = router.currentRoute.value;
  const chunkedPath = path.split('/');
  return chunkedPath[chunkedPath.length - 1];
});

/**
 * Since this component is shared between
 * creating and editing an organization,
 * this boolean helps differentiates the scenarios.
 */
const isCreate = computed(() => {
  return path.value === 'new';
});

const formData = computed(() => {
  return {
    name: name.value,
    businessRegNum: businessRegNum.value,
    address: address.value,
    postcode: postcode.value,
    contactNum: contactNum.value,
  } as FormData;
});

function hasValue(input: string): boolean {
  return input !== null && input.length > 0;
}

async function onSubmit() {
  if (isCreate.value === true) {
    await createOrganization();
  } else {
    await editOrganization();
  }

  // redirect on success
  router.push(OrgRoute);
}

/**
 * Create new organization and update store
 *
 * TODO: Error handling
 */
async function createOrganization() {
  // mock some default values before calling api
  const newOrg: Organization = {
    ...formData.value,
    id: new Date().getTime(), // use ms since epoch
    createBy: currentUserStore.currentUser!.id,
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
}

/**
 * Update organization and update store
 *
 * TODO: Error handling
 */
async function editOrganization() {
  const organizations = [...orgStore.organizations];
  const orgIndex = organizations.findIndex((org) => org.id === Number(id));

  if (orgIndex === -1) {
    // more error handling can be added here.
    return;
  }

  const organization = organizations[orgIndex];

  const updatedOrg = await api.organization.update({
    ...organization,
    // override values
    ...formData.value,
  });

  organizations[orgIndex] = {
    ...updatedOrg,
    // add creator name
    creatorName: organization.creatorName,
  };

  orgStore.setOrganizations(organizations);
}

async function fetchOrganization(id: number) {
  // well, the new organizations aren't in the mock data array.
  const organization = orgStore.organizations.length
    ? orgStore.organizations.find((o) => o.id === Number(id))
    : await api.organization.getById(Number(id));

  if (organization) {
    name.value = organization.name;
    businessRegNum.value = organization.businessRegNum;
    address.value = organization.address;
    postcode.value = organization.postcode;
    contactNum.value = organization.contactNum;
  }
}

/**
 * Assuming the organization is tied to creator,
 * redirect when user is not logged in.
 */
if (currentUserStore.currentUser === null) {
  router.push(LoginRoute);
}

// handle manual url updates
if (Number(id)) {
  await fetchOrganization(Number(id));
}

watch(path, async (currentPath) => {
  if (Number(currentPath)) {
    await fetchOrganization(Number(id));
    return;
  } else {
    // clear form value
    name.value = '';
    businessRegNum.value = '';
    address.value = '';
    postcode.value = '';
    contactNum.value = '';
  }
});
</script>

<template>
  <div class="q-pa-md">
    <q-card class="card">
      <q-card-section>
        <div class="text-h5">
          {{ isCreate ? 'New' : 'Edit' }} organization details
        </div>
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
            label="Contact number"
            pattern="^((\+?6?01)|(\+?6?0))[0-46-9]-*[0-9]{7,8}$"
            hint="01x-1234567 or 03x-12345678"
            lazy-rules
            :rules="[
              (val) => hasValue(val) || 'Contact number cannot be empty',
            ]"
          />
          <div>
            <q-btn no-caps class="full-width" type="submit" color="primary">
              {{ isCreate ? 'Submit' : 'Save' }}
            </q-btn>
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
