<template>
  <div class="root-lantiq">
    <p><strong>Root Lantiq Component</strong> - Interactive serial interface component (to be fully implemented)</p>
    <p v-if="!('serial' in navigator)">
      <em>Note: This feature requires a browser with Web Serial API support (Chrome/Edge)</em>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  unlockHuaweiShell?: boolean
}>()
</script>
