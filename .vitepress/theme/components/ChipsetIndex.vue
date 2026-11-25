<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import type { Chipset } from '../lib/firmware'

/** All the chipset families, with their chip models and the number of devices. */
const { theme } = useData()

const rows = computed(() =>
  ((theme.value.chipsets ?? []) as Chipset[]).map((c) => ({
    ...c,
    // the entries without a model number (e.g. just "Broadcom") are left out
    models: [...new Set(c.devices.map((d) => d.model))].filter((m) => /\d/.test(m)).sort()
  }))
)
</script>

<template>
  <table class="chipset-index">
    <thead>
      <tr>
        <th>Family</th>
        <th>Chipsets</th>
        <th>Devices</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="c in rows" :key="c.url">
        <td><a :href="withBase(c.url)">{{ c.title }}</a></td>
        <td>{{ c.models.join(', ') }}</td>
        <td>{{ c.devices.length }}</td>
      </tr>
    </tbody>
  </table>
</template>
