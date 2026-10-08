<script setup lang="ts">
import { onMounted, ref } from 'vue'

/** Start button + modal shared by the Web Serial procedures. */
defineProps<{
  label: string
  title: string
  procedure: string
}>()

const emit = defineEmits<{ open: []; close: [] }>()

const supported = ref(true)
const open = ref(false)

onMounted(() => {
  supported.value = 'serial' in navigator
})

function show() {
  open.value = true
  emit('open')
}

function hide() {
  open.value = false
  emit('close')
}
</script>

<template>
  <div class="serial-start">
    <button type="button" class="btn btn-blue" :disabled="!supported" @click="show">
      <s v-if="!supported">{{ label }}</s>
      <template v-else>{{ label }}</template>
    </button>
  </div>
  <div v-if="!supported" class="danger custom-block">
    <p class="custom-block-title">Note</p>
    <p>
      This browser is not compatible with the {{ procedure }} procedure. See the
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility">Browser compatibility</a>.
    </p>
  </div>
  <Teleport to="body">
    <div v-if="open" class="serial-modal">
      <div class="serial-modal-content" role="dialog" aria-modal="true">
        <div class="serial-modal-header">
          <h2>{{ title }}</h2>
          <button type="button" class="close" aria-label="Close" @click="hide">&times;</button>
        </div>
        <div class="serial-modal-body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.serial-start {
  margin: 24px 0;
  text-align: center;
  font-size: 1.25em;
}

.serial-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 64px 16px;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.6);
}

.serial-modal-content {
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  background-color: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-5);
  animation: animatetop 0.4s;
}

.serial-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.serial-modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.close {
  font-size: 28px;
  line-height: 1;
  color: var(--vp-c-text-2);
}

.close:hover {
  color: var(--vp-c-text-1);
}

.serial-modal-body {
  padding: 16px 24px;
}

@keyframes animatetop {
  from {
    transform: translateY(-300px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
