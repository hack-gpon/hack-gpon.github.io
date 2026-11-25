<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import type { Chipset } from '../lib/firmware'

/** Devices of the current chipset family page, from the `Chipset` row of their specifications. */
const { page, theme } = useData()

const chipset = computed(() => {
  const url = '/' + page.value.relativePath.replace(/(^|\/)index\.md$/, '$1')
  return ((theme.value.chipsets ?? []) as Chipset[]).find((c) => c.url === url)
})
</script>

<template>
  <table v-if="chipset?.devices.length" class="chipset-devices">
    <thead>
      <tr>
        <th>Device</th>
        <th>Type</th>
        <th>Chipset</th>
        <th>System</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="d in chipset.devices" :key="d.url + d.model">
        <td><a :href="withBase(d.url)">{{ d.title }}</a></td>
        <td>{{ d.type }}</td>
        <td>{{ d.model }}</td>
        <td>{{ d.system }}</td>
      </tr>
    </tbody>
  </table>
  <p v-else>No device links this chipset family yet.</p>
</template>
