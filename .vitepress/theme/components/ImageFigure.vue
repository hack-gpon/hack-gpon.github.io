<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'

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

// Lightbox with the original image: click to zoom to 100% and scroll around, Esc to close
const open = ref(false)
const zoomed = ref(false)
// The WebP is shown while the original, which can weigh several MB, is loading
const original = ref<string>()
const scroller = ref<HTMLElement>()

function show() {
  open.value = true
  zoomed.value = false
  original.value = undefined
  const img = new Image()
  img.onload = () => {
    if (open.value) original.value = img.src
  }
  img.src = src.value
  document.documentElement.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeydown)
}

function close() {
  open.value = false
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

// Zooms in keeping the clicked point in the middle of the screen
async function toggleZoom(event: MouseEvent) {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  zoomed.value = !zoomed.value
  if (!zoomed.value || !scroller.value) return
  await nextTick()
  const el = scroller.value
  el.scrollLeft = x * el.scrollWidth - el.clientWidth / 2
  el.scrollTop = y * el.scrollHeight - el.clientHeight / 2
}

onBeforeUnmount(() => {
  if (open.value) close()
})
</script>

<template>
  <figure class="image-figure">
    <a v-if="url" :href="url" target="_blank" rel="noopener">
      <picture>
        <source v-if="webp" :srcset="webp" type="image/webp" />
        <img :src="src" :alt="alt" :style="style" loading="lazy" />
      </picture>
    </a>
    <a v-else :href="src" class="zoomable" @click.prevent="show">
      <picture>
        <source v-if="webp" :srcset="webp" type="image/webp" />
        <img :src="src" :alt="alt" :style="style" loading="lazy" />
      </picture>
    </a>
    <figcaption v-if="caption" v-html="caption" />
  </figure>

  <Teleport to="body">
    <div v-if="open" class="lightbox" role="dialog" aria-modal="true" :aria-label="alt" @click.self="close">
      <div ref="scroller" class="lightbox-scroller" :class="{ zoomed }" @click.self="close">
        <img :src="original ?? webp ?? src" :alt="alt" @click="toggleZoom" />
      </div>
      <button class="lightbox-close" type="button" aria-label="Close" @click="close">×</button>
    </div>
  </Teleport>
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

.image-figure .zoomable {
  cursor: zoom-in;
}

.image-figure figcaption {
  padding: 8px 12px;
  font-size: 14px;
  background-color: var(--vp-c-bg-soft);
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.9);
}

.lightbox-scroller {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
}

.lightbox-scroller img {
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: zoom-in;
}

.lightbox-scroller.zoomed img {
  max-width: none;
  max-height: none;
  cursor: zoom-out;
}

.lightbox-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 28px;
  line-height: 40px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
}

.lightbox-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
