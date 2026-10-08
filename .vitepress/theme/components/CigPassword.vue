<script setup lang="ts">
import { ref } from 'vue'
import { cigpassword_gpon } from '../lib/cigpassword.js'

/** CIG/Nokia enable password generator. */
const props = withDefaults(
  defineProps<{
    username?: string
    /** XGS-PON variant: the username is the serial number */
    xgspon?: boolean
    passwordLen?: number
  }>(),
  { username: '', xgspon: false, passwordLen: 0 }
)

const serial = ref('')
const username = ref(props.username)
const password = ref('')
const validated = ref(false)

function generate(event: Event) {
  validated.value = true
  if (!(event.target as HTMLFormElement).checkValidity()) return
  if (props.xgspon) {
    password.value = cigpassword_gpon(serial.value, null, props.passwordLen, true)
    username.value = serial.value
  } else {
    password.value = cigpassword_gpon(serial.value, props.username)
  }
}
</script>

<template>
  <form class="hg-form" :class="{ validated }" novalidate @submit.prevent="generate">
    <label>
      <span>GPON S/N in format GPONabc12345</span>
      <input v-model="serial" type="text" placeholder="Serial Number" required pattern="[0-9A-Za-z]{4}[0-9A-Fa-f]{8}" />
      <small class="invalid">Please provide a valid GPON S/N.</small>
    </label>
    <div class="actions">
      <button type="submit" class="btn btn-primary">Generate!</button>
    </div>
    <label>
      <span>Username</span>
      <input :value="username" type="text" readonly />
    </label>
    <label>
      <span>Password</span>
      <input :value="password" type="text" readonly />
    </label>
  </form>
</template>
