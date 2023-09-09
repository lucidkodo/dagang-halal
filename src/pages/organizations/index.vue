<script lang="ts">
import { OrganizationWithCreatorName as Organization } from '../../../models/Organization';

// fetch data and massage data for display
async function fetchOrganizations(): Promise<Organization[]> {
  const data = await api.organization.getAll();
  const transformedData: Organization[] = data.map((org) => ({
    ...org,
    creatorName: '',
  }));

  /**
   * Map creator data to the organizations.
   * Can be optimized using SQL left join.
   */
  for (const org of transformedData) {
    const creator = await api.user.getById(org.createBy);
    if (creator) {
      org.creatorName = `${creator.firstName} ${creator.lastName}`;
    }
  }

  return transformedData;
}

const mockData = await fetchOrganizations();
</script>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import * as dayjs from 'dayjs';
import api from '../../../helpers/api';
import { useOrganizationsStore, useCurrentUserStore } from '../../store';
import { OrgDetailsRoute } from '../../routes';

const router = useRouter();
const store = useOrganizationsStore();
const { organizations } = storeToRefs(store);
const userStore = useCurrentUserStore();

/**
 * Read available actions from route meta,
 * and perform additional logic if needed.
 */
// const { pageActions } = router.currentRoute.value.meta as {
//   pageActions: string[];
// };
// const editAction = pageActions.find(
//   (action) => action === 'Organization.Modify'
// );
// const deleteAction = pageActions.find(
//   (action) => action === 'Organization.Delete'
// );

const canEdit = computed(() => {
  return userStore.currentUser?.permissions?.includes('Organization.Modify');
});

const canDelete = computed(() => {
  return userStore.currentUser?.permissions?.includes('Organization.Delete');
});

// table column options
const columns = [
  {
    label: 'Name',
    name: 'name',
    align: 'left',
  },
  {
    label: 'Business Reg Num',
    name: 'businessRegNum',
    align: 'right',
  },
  {
    label: 'Address',
    name: 'address',
    align: 'left',
    field: (row: Organization) => row,
    format: formatAddress,
  },
  {
    label: 'Create By',
    name: 'creatorName',
    align: 'left',
  },
  {
    label: 'Created On',
    name: 'createTimestamp',
    align: 'left',
    field: 'createTimestamp',
    format: (val: any) => `${val}`,
  },
];

/**
 * Shifts postcode before the state.
 *
 * KIV:
 * This function doesn't get invoked when using table slots.
 */
function formatAddress(org: Organization): string {
  const chunkedAddress = org.address.split(', ');
  const addressLine = chunkedAddress
    .slice(0, chunkedAddress.length - 1)
    .join(', ');
  const postcodeAndState = `${org.postcode} ${
    chunkedAddress[chunkedAddress.length - 1]
  }`;

  return [addressLine, postcodeAndState].join(', ');
}

function renderValue(row: Organization, col: keyof Organization) {
  switch (col) {
    case 'createTimestamp':
      return dayjs(row[col]).format('DD MMM YYYY');
    case 'address':
      return formatAddress(row);
    default:
      return row[col];
  }
}

// set up rows to be a computed value of state value
const rows = computed(() => {
  return organizations.value;
});

function goToDetailsPage(row: Organization) {
  router.push({
    ...OrgDetailsRoute,
    params: { id: row.id },
  });
}

function deleteOrganization(orgId: number) {
  const orgIndex = store.organizations.findIndex((o) => o.id === orgId);
  if (orgIndex === -1) {
    // TODO: add error handling
    return;
  }

  // or replace with api call
  store.organizations.splice(orgIndex, 1);
}

// use mock data when there's no data
if (store.organizations.length === 0) {
  store.setOrganizations(mockData);
}
</script>

<template>
  <div class="q-pa-md">
    <!-- <q-table :rows="rows" :columns="columns" row-key="name" /> -->
    <q-table :rows="rows" :columns="columns" row-key="id">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <b>{{ col.label }}</b>
          </q-th>
          <q-th class="text-left">
            <b>Actions</b>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in columns.map((col) => col.name)"
            :key="col"
            :props="props"
          >
            {{ renderValue(props.row, col) }}
          </q-td>
          <q-td class="actionBtns">
            <q-icon
              name="edit"
              class="edit"
              :disabled="!canEdit"
              @click="goToDetailsPage(props.row)"
            />
            <q-icon
              name="delete"
              class="delete"
              :disabled="!canDelete"
              @click="deleteOrganization(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<style lang="scss" scoped>
.actionBtns {
  i + i {
    margin-left: 10px;
  }
}

.q-icon {
  color: gray;
  cursor: pointer;

  &:hover.edit {
    color: $primary;
  }

  &:hover.delete {
    color: $negative;
  }
}
</style>
