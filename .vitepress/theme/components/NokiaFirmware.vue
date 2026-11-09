<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, useId } from 'vue'
import { inspectNokiaImage, NOKIA_SLOT_SIZE } from '../lib/nokiaImage.js'
import { flashNokiaFirmware } from '../lib/nokiaFirmware.js'
import SerialModal from './SerialModal.vue'

type BootMode = 'stage' | 'trial' | 'commit'
type State = 'idle' | 'checking' | 'ready' | 'connecting' | 'review' | 'working' | 'success' | 'error' | 'cancelled'
type Image = Readonly<{
  profile: string
  name: string
  size: number
  sha256: string
  crc32: string
}>
type Plan = {
  protectedSlot: number
  targetSlot: number
  offset: number
  slotSize: number
  image: Image
  bootMode: BootMode
  bootProfile: 'legacy' | '19.07'
  migrateBootScripts: boolean
}
type Result = {
  protectedSlot: number
  targetSlot: number
  offset: number
  size: number
  sha256: string
  bootMode: BootMode
  verified: true
}
type SerialNavigator = Navigator & { serial: { requestPort(): Promise<unknown> } }

const supportedName = 'nokia-g010sa_new_busybox_kernel_19.07-squashfs.image'
const supportedHash = '5c0d6853645d72748cf844f9e64fc57c38924cc7938ef14a40a827015bbc1248'
const controlId = useId()
const dialogOpen = ref(false)
const state = ref<State>('idle')
const busy = ref(false)
const checking = ref(false)
const message = ref('Choose a supported Nokia G-010S-A firmware image to begin.')
const filename = ref('')
const image = shallowRef<Image | null>(null)
const bootMode = ref<BootMode>('trial')
const plan = shallowRef<Plan | null>(null)
const result = shallowRef<Result | null>(null)
const backupAcknowledged = ref(false)
const backupUrl = ref('')
const phase = ref('')
const transferred = ref(0)
const transferTotal = ref(0)
let selectedBytes: Uint8Array | null = null
let fileGeneration = 0
let disposed = false
let controller: AbortController | null = null
let resolveReview: ((accepted: boolean) => void) | null = null

const canStart = computed(() => Boolean(image.value) && !busy.value && !checking.value)
const progressPercent = computed(() => transferTotal.value > 0
  ? Math.floor(100 * transferred.value / transferTotal.value)
  : 0)

function formatBytes(value: number) {
  return `${value.toLocaleString('en-US')} bytes (${(value / 1048576).toFixed(2)} MiB)`
}

function hex(value: number) {
  return `0x${value.toString(16).padStart(6, '0')}`
}

function modeLabel(mode: BootMode) {
  return {
    stage: 'Keep the current boot choice',
    trial: 'Try the new image on the next boot',
    commit: 'Use the new image as the default'
  }[mode]
}

function releaseBackup() {
  if (backupUrl.value) URL.revokeObjectURL(backupUrl.value)
  backupUrl.value = ''
}

function keepBackup(backup: unknown) {
  if (disposed) return
  releaseBackup()
  backupUrl.value = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2) + '\n'], {
    type: 'application/json'
  }))
}

async function chooseFile(event: Event) {
  if (busy.value) return
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  const generation = ++fileGeneration
  selectedBytes = null
  image.value = null
  plan.value = null
  result.value = null
  filename.value = file?.name ?? ''
  backupAcknowledged.value = false
  transferred.value = 0
  transferTotal.value = 0
  phase.value = ''
  releaseBackup()
  if (!file) {
    checking.value = false
    state.value = 'idle'
    message.value = 'Choose a supported Nokia G-010S-A firmware image to begin.'
    return
  }
  checking.value = true
  state.value = 'checking'
  message.value = 'Checking the image and its SHA-256 digest…'
  try {
    // Reject large dumps before allocating their contents in the browser.
    if (file.size > NOKIA_SLOT_SIZE) throw new Error('The file exceeds a 6 MiB Nokia firmware slot. Select the firmware image, not a full flash dump.')
    const bytes = new Uint8Array(await file.arrayBuffer())
    const metadata: Image = await inspectNokiaImage(bytes)
    if (disposed || generation !== fileGeneration) return
    selectedBytes = bytes
    image.value = metadata
    state.value = 'ready'
    message.value = 'Image recognized. Connect the Nokia UART adapter, then choose Connect and inspect.'
  } catch (error) {
    if (disposed || generation !== fileGeneration) return
    state.value = 'error'
    message.value = error instanceof Error ? error.message : String(error)
  } finally {
    if (!disposed && generation === fileGeneration) checking.value = false
  }
}

function confirm(accepted: boolean) {
  if (accepted && (!backupAcknowledged.value || !plan.value)) return
  const resolve = resolveReview
  resolveReview = null
  if (accepted && resolve) {
    state.value = 'working'
    message.value = 'Starting the transfer. Keep the module powered and the adapter connected until the result is shown.'
  }
  resolve?.(accepted)
}

function cancel() {
  controller?.abort()
  confirm(false)
}

function close() {
  dialogOpen.value = false
  cancel()
}

function successMessage(completed: Result) {
  const verified = `Firmware read back and verified in image${completed.targetSlot}. `
  if (completed.bootMode === 'stage') {
    return verified + 'The boot choice is unchanged. The module is still at the bootloader; power-cycle it to resume the current firmware.'
  }
  const selection = completed.bootMode === 'trial'
    ? `The new image is selected for the next boot; image${completed.protectedSlot} remains committed. `
    : 'The new image is selected as the default. '
  return verified + selection + 'The module is still at the bootloader. Power-cycle it, allow about one minute for the first startup, then verify UART and network access.'
}

async function start() {
  if (!canStart.value || !selectedBytes) return
  busy.value = true
  state.value = 'connecting'
  phase.value = 'connect'
  message.value = 'Choose the USB-UART adapter. Close any terminal using its COM port.'
  plan.value = null
  result.value = null
  backupAcknowledged.value = false
  transferred.value = 0
  transferTotal.value = 0
  releaseBackup()
  const operation = new AbortController()
  controller = operation
  const operationBytes = Uint8Array.from(selectedBytes)
  const operationMode = bootMode.value
  try {
    // Keep requestPort directly in the button's user gesture. The flash
    // operation independently revalidates the private image snapshot.
    const port = await (navigator as SerialNavigator).serial.requestPort()
    if (operation.signal.aborted) throw new DOMException('Cancelled', 'AbortError')
    const completed: Result = await flashNokiaFirmware(port, operationBytes, {
      signal: operation.signal,
      bootMode: operationMode,
      onStatus: (text: string) => { if (!disposed) message.value = text },
      onPhase: (next: string) => {
        if (disposed) return
        phase.value = next
        if (next !== 'review' && next !== 'success') state.value = 'working'
      },
      onProgress: (sent: number, total: number) => {
        if (disposed) return
        transferTotal.value = Math.max(0, total)
        transferred.value = Math.max(0, Math.min(sent, transferTotal.value))
      },
      onBackup: keepBackup,
      confirmFlash: (next: Plan) => {
        if (disposed || operation.signal.aborted) return Promise.resolve(false)
        plan.value = next
        backupAcknowledged.value = false
        state.value = 'review'
        message.value = 'Review the target slot and boot choice before erasing any flash.'
        return new Promise<boolean>((resolve) => { resolveReview = resolve })
      }
    })
    if (disposed) return
    result.value = completed
    state.value = 'success'
    message.value = successMessage(completed)
  } catch (error) {
    if (disposed) return
    const err = (error instanceof Error ? error : new Error(String(error))) as Error & { code?: string }
    // A cancelled erase/write or saveenv may already have changed the device.
    // Preserve the operation's uncertain-state result even when aborted.
    const uncertain = err.code === 'FLASH_UNCERTAIN' || err.code === 'SAVE_UNCERTAIN'
    const cancelled = !uncertain && (operation.signal.aborted || err.name === 'AbortError' || err.code === 'CANCELLED' || err.name === 'NotFoundError')
    state.value = cancelled ? 'cancelled' : 'error'
    message.value = cancelled
      ? 'Stopped. Commands already sent are not undone. Check the result before restarting the module or trying again.'
      : err.message
  } finally {
    confirm(false)
    controller = null
    busy.value = false
  }
}

onBeforeUnmount(() => {
  disposed = true
  fileGeneration++
  cancel()
  releaseBackup()
})
</script>

<template>
  <SerialModal
    label="Flash Nokia firmware"
    title="Nokia G-010S-A firmware"
    procedure="Nokia firmware flashing"
    @open="dialogOpen = true"
    @close="close"
  >
    <div class="nokia-firmware">
      <p>
        Upload a supported firmware image over UART. The other firmware slot is erased and written;
        the current committed image is kept for recovery.
      </p>
      <p class="help">
        Use the G-010S-A <a href="/ont-nokia-g-010s-a/#serial">3.3 V UART pinout</a>
        and close other programs using the COM port. The console must accept commands at
        <code>FALCON =&gt;</code>. The connection runs at 115200 baud.
      </p>

      <details class="supported-image">
        <summary>Supported firmware and SHA-256</summary>
        <p>Nokia G-010S-A OpenWrt 19.07 image dated 2026-08-14:</p>
        <p><code class="hash">{{ supportedName }}</code></p>
        <p><code class="hash">{{ supportedHash }}</code></p>
        <p>Matching the filename is insufficient. The complete file must match this digest.</p>
      </details>

      <div class="field">
        <label :for="`${controlId}-image`">Firmware image</label>
        <input :id="`${controlId}-image`" type="file" accept=".image,.img,.bin,application/octet-stream" :disabled="busy" @change="chooseFile" />
      </div>
      <div v-if="image" class="image-info">
        <p><strong>{{ image.name }}</strong><br />{{ formatBytes(image.size) }}</p>
        <p class="filename">{{ filename }}</p>
        <p><span class="help">SHA-256</span><br /><code class="hash">{{ image.sha256 }}</code></p>
      </div>

      <fieldset :disabled="busy || checking">
        <legend>Boot choice after the write</legend>
        <label class="choice">
          <input v-model="bootMode" :name="`${controlId}-mode`" type="radio" value="trial" />
          <span><strong>Try on the next boot</strong> — keep the current committed image.</span>
        </label>
        <label class="choice">
          <input v-model="bootMode" :name="`${controlId}-mode`" type="radio" value="stage" />
          <span><strong>Keep the current boot choice</strong> — write and verify the other slot only.</span>
        </label>
        <label class="choice">
          <input v-model="bootMode" :name="`${controlId}-mode`" type="radio" value="commit" />
          <span><strong>Make the new image the default</strong> — change the committed slot after verification.</span>
        </label>
      </fieldset>

      <div v-if="!busy" class="actions">
        <button type="button" class="btn btn-blue" :disabled="!canStart" @click="start">Connect and inspect</button>
      </div>
      <p class="status" :class="state" role="status" aria-live="polite">{{ message }}</p>

      <div v-if="transferTotal > 0" class="transfer-progress">
        <label :for="`${controlId}-progress`">Transfer to RAM: {{ progressPercent }}%</label>
        <progress :id="`${controlId}-progress`" :value="transferred" :max="transferTotal" />
        <p class="help">{{ formatBytes(transferred) }} of {{ formatBytes(transferTotal) }}</p>
      </div>

      <div v-if="plan" class="review">
        <div class="table-scroll">
          <table>
            <caption>Flash plan</caption>
            <tbody>
              <tr><th scope="row">Image kept for recovery</th><td><code>image{{ plan.protectedSlot }}</code></td></tr>
              <tr><th scope="row">Slot to erase and write</th><td><strong>image{{ plan.targetSlot }}</strong></td></tr>
              <tr><th scope="row">Full slot range</th><td><code>{{ hex(plan.offset) }}–{{ hex(plan.offset + plan.slotSize - 1) }}</code> ({{ formatBytes(plan.slotSize) }})</td></tr>
              <tr><th scope="row">Firmware</th><td>{{ plan.image.name }}<br />{{ formatBytes(plan.image.size) }}</td></tr>
              <tr><th scope="row">SHA-256</th><td><code class="hash">{{ plan.image.sha256 }}</code></td></tr>
              <tr><th scope="row">Boot choice</th><td>{{ modeLabel(plan.bootMode) }}</td></tr>
              <tr><th scope="row">Boot configuration</th><td>{{ plan.migrateBootScripts ? 'Update original Nokia boot selection for this firmware' : 'Keep the existing boot selection scripts' }}</td></tr>
            </tbody>
          </table>
        </div>
        <p v-if="plan.migrateBootScripts" class="help">
          After verifying the firmware, the tool will update the known Nokia boot selection scripts
          to this image's 19.07 version. That version resets the boot failure counter on each normal boot,
          preventing the old counter from unexpectedly switching images. The download below includes the original settings.
        </p>
        <p v-if="backupUrl">
          <a :href="backupUrl" download="nokia-g010sa-boot-before-flash.json">Download the original boot settings</a>
          <span class="help"> — these settings are only part of a full device backup.</span>
        </p>
        <template v-if="state === 'review'">
          <label class="choice backup-confirmation">
            <input v-model="backupAcknowledged" type="checkbox" />
            <span>I have a full flash backup of this module, including its factory data, and understand that image{{ plan.targetSlot }} will be erased.</span>
          </label>
          <button type="button" class="btn btn-blue" :disabled="!backupAcknowledged" @click="confirm(true)">Erase target slot and write firmware</button>
        </template>
      </div>

      <div v-if="busy" class="actions">
        <button type="button" class="btn" @click="cancel">Stop</button>
      </div>
      <p v-if="busy" class="help">
        Keep the module powered. Stopping or closing this dialog cannot undo commands already sent;
        an interrupted write may leave the target slot incomplete.
      </p>
      <p class="help">
        Only receiving <code>ROM:</code> lines?
        <a href="/ont-nokia-g-010s-a/#enabling-serial">Enable the serial console first</a>.
      </p>
    </div>
  </SerialModal>
  <div v-if="!dialogOpen && (busy || result || state === 'error' || state === 'cancelled')" class="last-result" :class="state" role="status" aria-live="polite">
    <p>{{ message }}</p>
    <a v-if="backupUrl" :href="backupUrl" download="nokia-g010sa-boot-before-flash.json">Download the original boot settings</a>
  </div>
</template>

<style scoped>
.nokia-firmware p {
  margin: 12px 0;
}
.help {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}
.supported-image, fieldset, .image-info {
  margin: 16px 0;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
summary, legend, .field > label {
  font-weight: 600;
}
summary {
  cursor: pointer;
}
.field {
  margin: 16px 0;
}
.field > label, .field > input {
  display: block;
  max-width: 100%;
  margin: 8px 0;
}
.choice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 12px 0;
  line-height: 1.5;
}
.choice input {
  flex: 0 0 auto;
  margin-top: 5px;
  accent-color: var(--vp-c-brand-1);
}
.filename, .hash {
  overflow-wrap: anywhere;
  word-break: break-word;
}
.hash {
  user-select: all;
}
.status {
  white-space: pre-wrap;
}
.error {
  color: var(--vp-c-red-1);
}
.success {
  color: var(--vp-c-green-1);
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0;
}
.transfer-progress progress {
  display: block;
  width: 100%;
  margin-top: 8px;
  accent-color: var(--vp-c-brand-1);
}
.table-scroll {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}
caption {
  text-align: left;
  font-weight: 600;
  margin-bottom: 8px;
}
th, td {
  text-align: left;
  vertical-align: top;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
}
th {
  min-width: 140px;
}
td {
  overflow-wrap: anywhere;
}
.last-result {
  margin: 16px 0;
}
.last-result p {
  margin-bottom: 8px;
}
a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
