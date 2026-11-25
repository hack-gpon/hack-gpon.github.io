<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { statusInfo, type CompatibilityStatus, type Firmware } from '../lib/firmware'
import FirmwareBadge from './FirmwareBadge.vue'

/** Firmwares of the current device page, from the `devices` of the firmware pages. */
const { page, theme } = useData()

const url = computed(() => '/' + page.value.relativePath.replace(/(^|\/)index\.md$/, '$1'))

/** The firmwares that run on the device first, then the untested ones and the broken ones. */
const tier: Record<CompatibilityStatus, number> = { works: 0, procedure: 0, reported: 0, untested: 1, broken: 2 }

// `firmwares` is already sorted by badge, and the sort is stable
const rows = computed(() =>
  ((theme.value.firmwares ?? []) as Firmware[])
    .flatMap((fw) => {
      const device = fw.devices.find((d) => d.url === url.value)
      return device ? [{ fw, status: device.status }] : []
    })
    .sort((a, b) => tier[a.status] - tier[b.status])
)
</script>

<template>
  <table v-if="rows.length" class="firmware-list">
    <thead>
      <tr>
        <th>Firmware</th>
        <th>Badge</th>
        <th>On this device</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="{ fw, status } in rows" :key="fw.url">
        <td>
          <a :href="withBase(fw.url)">{{ fw.title }}</a>
          <span v-if="!fw.maintained" class="unmaintained">no longer maintained</span>
        </td>
        <td><FirmwareBadge :type="fw.badge" /></td>
        <td>{{ statusInfo[status] }}</td>
      </tr>
    </tbody>
  </table>
  <p v-else>No firmware is documented for this device yet.</p>
</template>

<style scoped>
.unmaintained {
  margin-left: 8px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
