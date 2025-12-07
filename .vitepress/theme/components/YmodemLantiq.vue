<template>
  <div class="ymodem-lantiq">
    <p><strong>Ymodem Flash Component</strong> - Interactive firmware flashing interface (to be fully implemented)</p>
    <p v-if="!('serial' in navigator)">
      <em>Note: This feature requires a browser with Web Serial API support (Chrome/Edge)</em>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  dontLoadRootScript?: boolean
}>()
</script>
