<script setup lang="ts">
import { ref } from 'vue'

const fileName = ref('')
const result = ref<{ expected: string; calculated: string; match: boolean } | null>(null)
const error = ref('')
const dragging = ref(false)

function crc32Bzip2(data: Uint8Array): number {
  const poly = 0x04C11DB7
  let crc = 0xFFFFFFFF >>> 0
  for (const byte of data) {
    crc ^= (byte << 24) >>> 0
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x80000000 ? ((crc << 1) ^ poly) >>> 0 : (crc << 1) >>> 0
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function hex32(n: number): string {
  return '0x' + n.toString(16).padStart(8, '0')
}

function processFile(file: File) {
  error.value = ''
  result.value = null
  fileName.value = file.name

  const reader = new FileReader()
  reader.onload = () => {
    const buf = new Uint8Array(reader.result as ArrayBuffer)
    if (buf.length < 256) {
      error.value = `File too small: ${buf.length} bytes (need at least 256)`
      return
    }
    const expected = new DataView(buf.buffer).getUint32(252, true)
    const calculated = crc32Bzip2(buf.slice(0, 236))
    result.value = {
      expected: hex32(expected),
      calculated: hex32(calculated),
      match: expected === calculated
    }
  }
  reader.onerror = () => { error.value = 'Failed to read file' }
  reader.readAsArrayBuffer(file)
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) processFile(input.files[0])
}

function onDrop(event: DragEvent) {
  dragging.value = false
  if (event.dataTransfer?.files?.[0]) processFile(event.dataTransfer.files[0])
}
</script>

<template>
  <div
    class="hg-form"
    @dragover.prevent="dragging = true"
    @dragleave="dragging = false"
    @drop.prevent="onDrop"
  >
    <label
      class="dropzone"
      :class="{ active: dragging }"
    >
      <span>Drop your mfginfo partition dump here, or click to select</span>
      <input type="file" accept=".bin,.img,.dump,*" style="display:none" @change="onFileChange" />
      <small v-if="fileName">{{ fileName }}</small>
    </label>

    <div v-if="error" class="crc-result error">{{ error }}</div>

    <div v-if="result" class="crc-result" :class="result.match ? 'success' : 'error'">
      <table>
        <tr><td>Expected CRC</td><td><code>{{ result.expected }}</code></td></tr>
        <tr><td>Calculated CRC</td><td><code>{{ result.calculated }}</code></td></tr>
        <tr><td>Result</td><td><strong>{{ result.match ? 'MATCH' : 'MISMATCH' }}</strong></td></tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.25s, background-color 0.25s;
  text-align: center;
}

.dropzone:hover,
.dropzone.active {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
}

.crc-result {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid;
}

.crc-result.success {
  border-color: var(--vp-c-green-2);
  background-color: var(--vp-c-green-soft);
}

.crc-result.error {
  border-color: var(--vp-c-red-2);
  background-color: var(--vp-c-red-soft);
}

.crc-result table {
  width: 100%;
  border-collapse: collapse;
}

.crc-result td {
  padding: 4px 8px;
}

.crc-result td:first-child {
  font-weight: 500;
  white-space: nowrap;
}
</style>
