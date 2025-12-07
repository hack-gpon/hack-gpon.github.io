<template>
  <details>
    <summary>{{ title }}</summary>
    <div class="language-plaintext">
      <pre><code>{{ content }}</code></pre>
    </div>
  </details>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  file?: string
  content?: string
}>()
</script>
