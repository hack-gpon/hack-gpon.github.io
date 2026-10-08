<script setup lang="ts">
import { useData } from 'vitepress'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{ code: string }>()

const { isDark } = useData()
const svg = ref('')
let counter = 0

async function render() {
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({ startOnLoad: false, theme: isDark.value ? 'dark' : 'default' })
  const id = `mermaid-${Math.random().toString(36).slice(2)}-${counter++}`
  svg.value = (await mermaid.render(id, decodeURIComponent(props.code))).svg
}

onMounted(render)
watch(isDark, render)
</script>

<template>
  <div class="mermaid" v-html="svg" />
</template>

<style scoped>
.mermaid {
  margin: 16px 0;
  overflow-x: auto;
}
</style>
