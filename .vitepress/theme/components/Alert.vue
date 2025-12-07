<template>
  <div :class="['alert-container', `alert-${color}`]">
    <div class="alert-content">
      <span v-if="icon" class="alert-icon">
        <component :is="iconComponent" />
      </span>
      <div class="alert-body">
        <strong v-if="alert">{{ alert }}: </strong>
        <span v-html="content"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  content: string
  alert?: string
  icon?: string
  color?: 'red' | 'yellow' | 'green' | 'blue'
}>()

// Simple icon components
const WarningIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
}

const InfoIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
}

const iconComponent = computed(() => {
  if (props.icon === 'svg-warning') return WarningIcon
  if (props.icon === 'svg-info') return InfoIcon
  return null
})
</script>

<style scoped>
.alert-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.alert-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.alert-body {
  flex: 1;
}
</style>
