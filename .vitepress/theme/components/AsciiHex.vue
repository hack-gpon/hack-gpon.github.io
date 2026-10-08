<script setup lang="ts">
import { ref } from 'vue'

const ascii = ref('')
const asciiGlue = ref(' ')
const hexResult = ref('')
const asciiValidated = ref(false)

const hex = ref('')
const hexSeparator = ref(' ')
const asciiResult = ref('')
const hexValidated = ref(false)

function getChunks(s: string, i: number) {
  const a: string[] = []
  do {
    a.push(s.substring(0, i))
  } while ((s = s.substring(i)) !== '')
  return a
}

function asciiToHex(event: Event) {
  asciiValidated.value = true
  if (!(event.target as HTMLFormElement).checkValidity()) return
  const str = ascii.value
  const glue = asciiGlue.value
  const prefixItem = glue !== '' ? '0x' : ''
  const prefix = glue === '' ? '0x' : ''
  hexResult.value = prefix + [...str].map((_, n) => prefixItem + Number(str.charCodeAt(n)).toString(16)).join(glue)
}

function hexToAscii(event: Event) {
  hexValidated.value = true
  if (!(event.target as HTMLFormElement).checkValidity()) return
  const str = hex.value
  const separator = hexSeparator.value
  asciiResult.value =
    separator === ''
      ? getChunks(str.substring(2), 2)
          .map((el) => String.fromCharCode(parseInt(el, 16)))
          .join('')
      : str
          .split(separator)
          .map((el) => String.fromCharCode(Number(el)))
          .join('')
}
</script>

<template>
  <h2>ASCII To Hex</h2>
  <form class="hg-form" :class="{ validated: asciiValidated }" novalidate @submit.prevent="asciiToHex">
    <label>
      <span>ASCII</span>
      <input v-model="ascii" type="text" placeholder="ASCII" required />
      <small class="invalid">Please provide a valid text input.</small>
    </label>
    <label>
      <span>
        Glue/Separator (empty for the format <code>0x0123456789ABCDE</code>, <code>&nbsp;</code> for the format
        <code>0x01 0x23 0x45 0x67 0x89 0xAB 0xCD 0xEF</code>)
      </span>
      <input v-model="asciiGlue" type="text" placeholder="Glue" />
    </label>
    <div class="actions">
      <button type="submit" class="btn btn-primary">Calculate!</button>
    </div>
    <label>
      <span>HEX Result</span>
      <input :value="hexResult" type="text" readonly />
    </label>
  </form>

  <h2>Hex To ASCII</h2>
  <form class="hg-form" :class="{ validated: hexValidated }" novalidate @submit.prevent="hexToAscii">
    <label>
      <span>HEX</span>
      <input v-model="hex" type="text" placeholder="HEX" required />
      <small class="invalid">Please provide a valid text input.</small>
    </label>
    <label>
      <span>
        Glue/Separator (empty for the format <code>0x0123456789ABCDEF</code>, <code>&nbsp;</code> for the format
        <code>0x01 0x23 0x45 0x67 0x89 0xAB 0xCD 0xEF</code>)
      </span>
      <input v-model="hexSeparator" type="text" placeholder="Separator" />
    </label>
    <div class="actions">
      <button type="submit" class="btn btn-primary">Calculate!</button>
    </div>
    <label>
      <span>ASCII Result</span>
      <input :value="asciiResult" type="text" readonly />
    </label>
  </form>
</template>
