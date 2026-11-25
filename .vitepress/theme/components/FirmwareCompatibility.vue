<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { statusInfo, type Firmware } from '../lib/firmware'

/** Compatibility table of the current firmware page. */
const { page, theme } = useData()

const firmware = computed(() => {
  const url = '/' + page.value.relativePath.replace(/(^|\/)index\.md$/, '$1')
  return ((theme.value.firmwares ?? []) as Firmware[]).find((fw) => fw.url === url)
})
</script>

<template>
  <table v-if="firmware" class="firmware-compatibility">
    <thead>
      <tr>
        <th>Device</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="d in firmware.devices" :key="d.url">
        <td><a :href="withBase(d.url)">{{ d.title }}</a></td>
        <td>{{ statusInfo[d.status] }}</td>
      </tr>
    </tbody>
  </table>
</template>
