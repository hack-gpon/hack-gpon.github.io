<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { enableNokiaSerial } from '../lib/nokiaSerial.js'
import SerialModal from './SerialModal.vue'

type Settings = { asc0: string | null; bootdelay: string | null; preboot: string | null }
type Plan = { before: Settings; after: Settings }
type State = 'idle' | 'connecting' | 'review' | 'saving' | 'success' | 'error' | 'cancelled'

const keys = ['asc0', 'bootdelay', 'preboot'] as const
const state = ref<State>('idle')
const message = ref('')
const busy = ref(false)
const dialogOpen = ref(false)
const plan = shallowRef<Plan | null>(null)
const backupUrl = ref('')
let controller: AbortController | null = null
let resolveReview: ((accepted: boolean) => void) | null = null

function releaseBackup() {
  if (backupUrl.value) URL.revokeObjectURL(backupUrl.value)
  backupUrl.value = ''
}

function keepBackup(before: Settings) {
  releaseBackup()
  const backup = { model: 'Nokia G-010S-A', savedAt: new Date().toISOString(), settings: before }
  backupUrl.value = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2) + '\n'], {
    type: 'application/json'
  }))
}

function confirm(accepted: boolean) {
  const resolve = resolveReview
  resolveReview = null
  if (accepted) {
    state.value = 'saving'
    message.value = 'Saving UART settings. Keep the module powered until the result is shown.'
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

async function start() {
  // Closing and reopening while a reader is shutting down must not start a
  // second operation on the same physical port.
  dialogOpen.value = true
  if (busy.value) return
  busy.value = true
  state.value = 'connecting'
  message.value = 'Choose the USB-UART adapter. Close other programs using its COM port.'
  plan.value = null
  releaseBackup()
  const operation = new AbortController()
  controller = operation

  try {
    const port = await (navigator as any).serial.requestPort()
    if (operation.signal.aborted) throw new DOMException('Cancelled', 'AbortError')
    await enableNokiaSerial(port, {
      signal: operation.signal,
      onStatus: (text: string) => { message.value = text },
      onBackup: keepBackup,
      confirmChanges: (next: Plan) => {
        plan.value = next
        state.value = 'review'
        message.value = 'The FALCON console answered the verification command. Review the changes before saving.'
        return new Promise<boolean>((resolve) => { resolveReview = resolve })
      }
    })
    state.value = 'success'
    message.value = 'UART settings verified. The module is still at the bootloader; power-cycle it to resume booting, then check UART and network access.'
  } catch (error) {
    const err = error as Error & { code?: string }
    // Cancellation after saveenv was sent must retain the uncertain-save
    // explanation instead of presenting the operation as merely cancelled.
    const cancelled = err.code !== 'SAVE_FAILED' &&
      (operation.signal.aborted || err.name === 'AbortError' || err.code === 'CANCELLED')
    state.value = cancelled ? 'cancelled' : 'error'
    message.value = cancelled
      ? 'Stopped. Commands already sent are not rolled back. If you cancelled while saving, check the module before restarting it.'
      : err.message
  } finally {
    confirm(false)
    controller = null
    busy.value = false
  }
}

onBeforeUnmount(() => {
  cancel()
  releaseBackup()
})
</script>

<template>
  <SerialModal
    label="Configure Nokia UART"
    title="Nokia G-010S-A UART console"
    procedure="Nokia UART setup"
    @open="start"
    @close="close"
  >
    <div class="nokia-serial">
      <p>
        This configures serial access on a Nokia G-010S-A with an accessible U-Boot console.
        It does not install firmware or unlock a Linux account.
      </p>
      <p class="status" :class="state" role="status" aria-live="polite">{{ message }}</p>

      <template v-if="plan">
        <table>
          <caption>UART settings</caption>
          <thead>
            <tr><th scope="col">Setting</th><th scope="col">Current</th><th scope="col">After saving</th></tr>
          </thead>
          <tbody>
            <tr v-for="key in keys" :key="key">
              <th scope="row"><code>{{ key }}</code></th>
              <td><code>{{ plan.before[key] === null ? '(unset)' : plan.before[key] }}</code></td>
              <td><code>{{ plan.after[key] === null ? '(unset)' : plan.after[key] }}</code></td>
            </tr>
          </tbody>
        </table>
      </template>

      <p v-if="backupUrl">
        <a :href="backupUrl" download="nokia-g010sa-uart-before.json">Download the original settings</a>
      </p>
      <div class="actions">
        <button v-if="state === 'review'" type="button" class="btn btn-blue" @click="confirm(true)">Save UART settings</button>
        <button v-if="busy" type="button" class="btn" @click="cancel">Stop</button>
      </div>
      <p class="help">
        Only receiving <code>ROM: …</code>?
        <a href="/ont-nokia-g-010s-a/#enabling-serial">Enable the console through SSH first</a>.
        Closing this dialog stops further commands; it does not undo changes already sent.
      </p>
    </div>
  </SerialModal>
  <div v-if="!dialogOpen && message" class="last-result" :class="state" role="status">
    <p>{{ message }}</p>
    <a v-if="backupUrl" :href="backupUrl" download="nokia-g010sa-uart-before.json">Download the original settings</a>
  </div>
</template>

<style scoped>
.nokia-serial p {
  margin: 12px 0;
}
.status {
  white-space: pre-wrap;
}
.last-result {
  margin: 16px 0;
}
.error {
  color: var(--vp-c-red-1);
}
.success {
  color: var(--vp-c-green-1);
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
  overflow-wrap: anywhere;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.help {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}
a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}
</style>
