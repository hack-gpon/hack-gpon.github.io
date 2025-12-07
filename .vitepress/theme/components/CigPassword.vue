<template>
  <div>
    <form id="cig-password" novalidate @submit.prevent="handleSubmit">
      <div class="form-floating mb-3">
        <label for="serial" class="form-label">GPON S/N in format GPONabc12345</label>
        <input
          v-model="serial"
          type="text"
          class="form-control"
          placeholder="Serial Number"
          name="serial"
          id="serial"
          required
          pattern="[0-9A-Za-z]{4}[0-9A-Fa-f]{8}"
        />
        <div class="invalid-feedback">Please provide a valid GPON S/N.</div>
      </div>
      <div class="mb-3">
        <button type="submit" class="btn btn-primary">Generate!</button>
        <label for="submit" class="form-label"
          >Warning: this script is hosted on a third-party server.</label
        >
      </div>
      <div class="form-floating mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          readonly
          type="text"
          class="form-control"
          placeholder="Username"
          name="username"
          id="username"
          :value="username"
        />
      </div>
      <div class="form-floating mb-3">
        <label for="result" class="form-label">Password</label>
        <input
          readonly
          class="form-control"
          type="text"
          id="result"
          placeholder="Result"
          v-model="result"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CryptoJS from 'crypto-js'

const props = defineProps<{
  username?: string
}>()

const serial = ref('')
const result = ref('')
const validated = ref(false)

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}

function cigpassword_gpon(
  ont_serial: string,
  ont_user: string,
  length: number = 0,
  xgspon: boolean = false
): string {
  const hardcoded_key = '01030a1013051764c8061419b49d0500'
  const hardcoded_seed =
    '2345679abcdefghijkmnpqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ'

  let ont_vendor = ont_serial.substring(0, 4).toUpperCase()
  let ont_id = ont_serial.substring(4).toLowerCase()

  if (xgspon) {
    ont_id = ont_id.toUpperCase()
  }

  let formatted_serial = `${ont_vendor}${ont_id}`

  let key_bytes = new Uint8Array(
    hardcoded_key.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  )
  if (length > 0) {
    key_bytes[15] = length
  }

  let formatted_serial_user = formatted_serial
  if (ont_user) {
    formatted_serial_user += `-${ont_user}`
  }

  let hmac = CryptoJS.HmacMD5(
    formatted_serial_user,
    CryptoJS.lib.WordArray.create(key_bytes as any)
  )
  let pw_md5_hmac = hexToBytes(hmac.toString(CryptoJS.enc.Hex))

  let output = Array(pw_md5_hmac.length)

  for (let i = 0; i < pw_md5_hmac.length; i++) {
    output[i] = hardcoded_seed[pw_md5_hmac[i] % 0x36]
  }

  if (length > 0) {
    return output.slice(0, length).join('')
  } else {
    return output.join('')
  }
}

function handleSubmit(event: Event) {
  const form = event.target as HTMLFormElement
  validated.value = true

  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  } else {
    result.value = cigpassword_gpon(serial.value, props.username || '')
  }

  form.classList.add('was-validated')
}
</script>

<style scoped>
.mb-3 {
  margin-bottom: 1rem;
}
</style>
