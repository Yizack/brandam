<script setup lang="ts">
import type { Row, TableMeta } from "@tanstack/vue-table";

const { data: invites } = await useFetch("/api/invites", {
  key: "invites",
  lazy: true,
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
});

const columns = [
  {
    id: "brand",
    header: "Brand"
  },
  {
    id: "date",
    header: "Date"
  },
  {
    accessorKey: "role",
    header: "Role"
  },
  {
    id: "action",
    header: "Action"
  }
];

const data = invites.value?.map(invite => ({
  brand: invite.brand,
  date: invite.createdAt,
  role: roleNames[invite.roleId]
})) || [];

const meta: TableMeta<typeof data[0]> = {
  class: {
    tr: (row: Row<typeof data[0]>) => {
      if (row.index % 2 === 0) return "bg-muted/50";
      return "";
    }
  }
};
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-xl font-semibold">Pending brand invites <UBadge :label="data.length" variant="outline" class="tabular-nums px-2" /></h2>
      <p class="text-muted">Accepting an invite will give you access to the brand's dashboard and resources.</p>
    </div>
    <UTable :columns="columns" :data="data" class="border border-muted rounded-md" :meta="meta" empty="No pending invites">
      <template #brand-cell="{ row }">
        <div class="flex items-center space-x-3">
          <UUser :description="row.original.brand.description || ''">
            <template #name>
              <ULink :to="`/${row.original.brand.slug}`" class="underline text-lg">{{ row.original.brand.name }}</ULink>
            </template>
          </UUser>
        </div>
      </template>
      <template #date-cell="{ row }">
        <NuxtTime :datetime="row.original.date" />
      </template>
      <template #action-cell>
        <UButton label="Accept" variant="subtle" color="success" />
      </template>
    </UTable>
  </section>
</template>
