<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed } from 'vue'
import { badgeInfo, type FirmwareBadge } from '../lib/firmware'

/** Firmware badge, linked to the description of the badges. */
const props = defineProps<{ type: FirmwareBadge }>()

const info = computed(() => badgeInfo[props.type])
</script>

<template>
  <a v-if="info" class="firmware-badge" :href="withBase('/firmware/#badges')" :title="info.description">
    <img :src="withBase(`/badges/${type}.svg`)" :alt="info.label" height="20" />
  </a>
</template>

<style scoped>
.firmware-badge {
  display: inline-flex;
  vertical-align: middle;
  white-space: nowrap;
  text-decoration: none;
}

.firmware-badge img {
  height: 20px;
  width: auto;
  max-width: none;
}
</style>
