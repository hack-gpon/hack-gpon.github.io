<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { statusInfo, type Firmware } from '../lib/firmware'
import FirmwareBadge from './FirmwareBadge.vue'

/** Firmwares of the current device page, from the `devices` of the firmware pages. */
const { page, theme } = useData()

const url = computed(() => '/' + page.value.relativePath.replace(/(^|\/)index\.md$/, '$1'))

const rows = computed(() =>
  ((theme.value.firmwares ?? []) as Firmware[]).flatMap((fw) => {
    const device = fw.devices.find((d) => d.url === url.value)
    return device ? [{ fw, status: device.status }] : []
  })
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
