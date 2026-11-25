<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import type { Chipset, Firmware } from '../lib/firmware'
import FirmwareBadge from './FirmwareBadge.vue'

/** Firmwares that run on at least one device of the current chipset family page. */
const { page, theme } = useData()

const rows = computed(() => {
  const url = '/' + page.value.relativePath.replace(/(^|\/)index\.md$/, '$1')
  const chipset = ((theme.value.chipsets ?? []) as Chipset[]).find((c) => c.url === url)
  const devices = new Set(chipset?.devices.map((d) => d.url))
  return ((theme.value.firmwares ?? []) as Firmware[])
    .map((fw) => ({ fw, devices: fw.devices.filter((d) => devices.has(d.url)) }))
    .filter((r) => r.devices.length)
})
</script>

<template>
  <table v-if="rows.length" class="chipset-firmwares">
    <thead>
      <tr>
        <th>Firmware</th>
        <th>Badge</th>
        <th>Devices</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="{ fw, devices } in rows" :key="fw.url">
        <td><a :href="withBase(fw.url)">{{ fw.title }}</a></td>
        <td><FirmwareBadge :type="fw.badge" /></td>
        <td>{{ devices.length }}</td>
      </tr>
    </tbody>
  </table>
  <p v-else>No firmware is documented for this chipset family yet.</p>
</template>
