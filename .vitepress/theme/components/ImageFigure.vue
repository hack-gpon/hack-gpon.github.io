<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed } from 'vue'

/** Image stored in `public/assets/img/`, with an optional caption and link. */
const props = defineProps<{
  file: string
  alt?: string
  caption?: string
  url?: string
  maxWidth?: string | number
}>()

const src = computed(() => withBase(`/assets/img/${props.file.replace(/\\/g, '/')}`))
// The WebP copies are made by scripts/optimize-images.mjs, so they only exist in the built site
const webp = computed(() =>
  import.meta.env.PROD && /\.(jpe?g|png)$/i.test(src.value) ? src.value.replace(/\.(jpe?g|png)$/i, '.webp') : undefined
)
const style = computed(() => (props.maxWidth ? { maxWidth: `${props.maxWidth}px` } : undefined))
</script>

<template>
  <figure class="image-figure">
    <!-- Without an explicit link, the image opens the original at full resolution -->
    <a :href="url ?? src" target="_blank" rel="noopener">
      <picture>
        <source v-if="webp" :srcset="webp" type="image/webp" />
        <img :src="src" :alt="alt" :style="style" loading="lazy" />
      </picture>
    </a>
    <figcaption v-if="caption" v-html="caption" />
  </figure>
</template>

<style scoped>
.image-figure {
  display: table;
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.image-figure img {
  display: block;
  max-width: 100%;
}

.image-figure figcaption {
  padding: 8px 12px;
  font-size: 14px;
  background-color: var(--vp-c-bg-soft);
}
</style>
