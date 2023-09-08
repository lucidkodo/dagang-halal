<script setup lang="ts">
import { computed } from 'vue';
import * as dayjs from 'dayjs';
import api from '../../../helpers/api';
import { useOrganizationsStore } from '../../store';
import { OrganizationWithCreatorName as Organization } from '../../../models/Organization';

const store = useOrganizationsStore();

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
    label: 'Created by',
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
  return store.organizations;
});

// fetch data
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

store.setOrganizations(transformedData);
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
          <q-th class="text-left">Actions</q-th>
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
            <a :href="'#edit-' + props.row.id">
              <q-icon name="edit" class="edit" />
            </a>
            <a :href="'#delete-' + props.row.id">
              <q-icon name="delete" class="delete" />
            </a>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<style lang="scss" scoped>
.actionBtns {
  a + a {
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
