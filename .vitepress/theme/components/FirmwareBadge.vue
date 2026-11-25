<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed } from 'vue'
import { badgeInfo, type FirmwareBadge } from '../lib/firmware'
import { badgeStyles, checkPath, exclamationPath, sealPath } from '../lib/badgeShape.mjs'

/** Firmware badge (seal icon and label), linked to the description of the badges. */
const props = withDefaults(defineProps<{ type: FirmwareBadge; label?: boolean }>(), { label: true })

const info = computed(() => badgeInfo[props.type])
const style = computed(() => badgeStyles[props.type])
</script>

<template>
  <a
    v-if="info"
    class="firmware-badge"
    :class="[`fb-${style.color}`, style.filled ? 'fb-filled' : 'fb-outline']"
    :href="withBase('/firmware/#badges')"
    :title="info.description"
  >
    <svg viewBox="0 0 16 16" role="img" :aria-label="info.label">
      <path class="seal" :d="sealPath" />
      <template v-if="style.mark === 'check'">
        <path class="mark" :d="checkPath" />
      </template>
      <template v-else>
        <path class="mark" :d="exclamationPath" />
        <circle class="dot" cx="8" cy="11.3" r="0.95" />
      </template>
    </svg>
    <span v-if="label" class="label">{{ info.label }}</span>
  </a>
</template>

<style scoped>
.firmware-badge {
  --fb-color: var(--vp-c-text-2);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  vertical-align: middle;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.vp-doc .firmware-badge {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.firmware-badge svg {
  flex: none;
  width: 20px;
  height: 20px;
}

.fb-green {
  --fb-color: #1a7f37;
}
.fb-blue {
  --fb-color: #0969da;
}
.fb-red {
  --fb-color: #cf222e;
}
.fb-white {
  --fb-color: #8c959f;
}

.dark .fb-green {
  --fb-color: #3fb950;
}
.dark .fb-blue {
  --fb-color: #4493f8;
}
.dark .fb-red {
  --fb-color: #f85149;
}
.dark .fb-white {
  --fb-color: #f0f6fc;
}

.fb-filled .seal {
  fill: var(--fb-color);
}
.fb-filled .mark {
  stroke: #fff;
}
.fb-filled .dot {
  fill: #fff;
}

.fb-outline .seal {
  fill: none;
  stroke: var(--fb-color);
  stroke-width: 1.2;
  stroke-linejoin: round;
}
.fb-outline .mark {
  stroke: var(--fb-color);
}
.fb-outline .dot {
  fill: var(--fb-color);
}

.mark {
  fill: none;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
