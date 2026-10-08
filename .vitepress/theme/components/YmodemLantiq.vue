<script setup lang="ts">
import { ref } from 'vue'
import {
  changeBaudrate,
  flashImageMtd,
  lantiqRootUboot,
  sendImageMtd,
  waitEndImageLoad
} from '../lib/rootLantiq.js'
import SerialModal from './SerialModal.vue'

/** Web Serial firmware flash procedure (Ymodem) for Lantiq based sticks. */
const props = defineProps<{ modelName: string }>()

const file = ref<File | null>(null)
const baudRateOc = ref(false)
const image = ref('image0')
const progress = ref(0)
const message = ref('')
const status = ref<'' | 'success' | 'error'>('')
const validated = ref(false)
const busy = ref(false)

let port: any

function loading(msg: string) {
  message.value = msg
  status.value = ''
}

function showError(msg: string) {
  message.value = msg
  status.value = 'error'
  console.log(msg)
}

async function choosePort() {
  message.value = ''
  status.value = ''
  progress.value = 0
  try {
    port = await (navigator as any).serial.requestPort()
  } catch (err) {
    port = undefined
    showError(`Error: ${(err as Error).message}`)
  }
}

function onFile(event: Event) {
  file.value = (event.target as HTMLInputElement).files?.[0] ?? null
}

async function flash(event: Event) {
  validated.value = true
  if (!(event.target as HTMLFormElement).checkValidity() || !file.value) return
  if (!port) {
    showError('Error: port not open')
    return
  }
  validated.value = false
  busy.value = true
  try {
    const data = new Uint8Array(await file.value.arrayBuffer())

    /* Unlock U-Boot if needed and stop booting */
    if (!(await lantiqRootUboot(port, props.modelName, loading, showError))) return

    let baudrate = 115200
    if (baudRateOc.value) {
      const newBaudrate = 230400
      loading(`Changing baudrate to: ${newBaudrate}`)
      if (!(await changeBaudrate(port, newBaudrate, baudrate, showError))) return
      baudrate = newBaudrate
    }

    loading('Start sending image to the SFP...')
    const sent = await sendImageMtd(port, data, baudrate, showError, (byteTransfered: number) => {
      const perc = (byteTransfered / data.length) * 100
      progress.value = perc
      loading(`Image transfer: ${Math.trunc(perc * 100) / 100}% complete`)
    })
    if (!sent) return

    if (!(await waitEndImageLoad(port, baudrate, showError))) return

    if (baudRateOc.value) {
      const newBaudrate = 115200
      loading(`Restore baudrate to: ${newBaudrate}`)
      if (!(await changeBaudrate(port, newBaudrate, baudrate, showError))) return
      baudrate = newBaudrate
    }

    loading('Transfer complete, image flash in progress. DO NOT REMOVE the SFP!')
    if (await flashImageMtd(port, image.value, baudrate, showError)) {
      message.value = 'Flash completed, now you can remove the SFP'
      status.value = 'success'
    }
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <SerialModal label="Start flash!" title="Flash firmware" procedure="web flash" @open="choosePort">
    <form class="hg-form" :class="{ validated }" novalidate @submit.prevent="flash">
      <label>
        <span>Flash MTD</span>
        <input type="file" required @change="onFile" />
      </label>
      <label class="check">
        <input v-model="baudRateOc" type="checkbox" />
        230400 baud rate, do not enable unless told to do so
      </label>
      <div class="radio-group">
        <label><input v-model="image" type="radio" value="image0" /> Image 0</label>
        <label><input v-model="image" type="radio" value="image1" /> Image 1</label>
      </div>
      <div class="actions">
        <button type="submit" class="btn btn-primary" :disabled="busy">Flash!</button>
      </div>
      <progress :value="progress" max="100" />
      <p class="status" :class="status">{{ message }}</p>
    </form>
  </SerialModal>
</template>

<style scoped>
progress {
  width: 100%;
}

.status.success {
  color: var(--vp-c-green-1);
}

.status.error {
  color: var(--vp-c-red-1);
}
</style>
