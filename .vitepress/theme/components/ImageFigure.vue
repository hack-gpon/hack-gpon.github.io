<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  file?: string
  src?: string
  alt: string
  caption?: string
}>()

const imageSrc = computed(() => {
  if (props.src) return props.src
  if (props.file) return `/assets/img/${props.file}`
  return ''
})
</script>

<template>
  <figure class="image-figure">
    <img :src="imageSrc" :alt="alt" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>
