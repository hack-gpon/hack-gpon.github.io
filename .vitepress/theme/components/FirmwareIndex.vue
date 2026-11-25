<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import type { Firmware } from '../lib/firmware'
import FirmwareBadge from './FirmwareBadge.vue'

/** All the documented firmwares, from the best badge to the worst. */
const { theme } = useData()

const firmwares = computed(() => (theme.value.firmwares ?? []) as Firmware[])
</script>

<template>
  <table class="firmware-index">
    <thead>
      <tr>
        <th>Firmware</th>
        <th>Badge</th>
        <th>Platform</th>
        <th>Devices</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="fw in firmwares" :key="fw.url">
        <td>
          <a :href="withBase(fw.url)">{{ fw.title }}</a>
          <span v-if="!fw.maintained" class="unmaintained">no longer maintained</span>
        </td>
        <td><FirmwareBadge :type="fw.badge" /></td>
        <td>{{ fw.platform }}</td>
        <td>
          <template v-for="(d, i) in fw.devices" :key="d.url">
            <template v-if="i">, </template>
            <a :href="withBase(d.url)">{{ d.title }}</a>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.unmaintained {
  display: block;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
