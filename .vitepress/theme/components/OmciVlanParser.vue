<script setup lang="ts">
import { ref } from 'vue'
import { vlanTableParse } from '../lib/omciVlan.js'

const fields = [
  'Filter outer priority',
  'Filter outer VID',
  'Filter outer TPID',
  'Filter inner priority',
  'Filter inner VID',
  'Filter inner TPID',
  'Filter ether type',
  'Treatment tags to remove',
  'Treatment outer priority',
  'Treatment outer VID',
  'Treatment outer TPID',
  'Treatment inner priority',
  'Treatment inner VID',
  'Treatment inner TPID'
]

const hex = ref('')
const rules = ref<number[][]>([])
const error = ref('')
const validated = ref(false)

function decode(event: Event) {
  validated.value = true
  if (!(event.target as HTMLFormElement).checkValidity()) return
  try {
    error.value = ''
    rules.value = vlanTableParse(hex.value)
  } catch (e) {
    rules.value = []
    error.value = (e as Error).message
  }
}
</script>

<template>
  <form class="hg-form" :class="{ validated }" novalidate @submit.prevent="decode">
    <label>
      <span>VLAN TABLE in HEX</span>
      <input v-model="hex" type="text" placeholder="VLAN TABLE in HEX" required />
      <small class="invalid">Please provide a valid text input.</small>
    </label>
    <div class="actions">
      <button type="submit" class="btn btn-primary">Decode!</button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <table v-for="(rule, i) in rules" :key="i">
      <tbody>
        <tr v-for="(name, j) in fields" :key="name">
          <td>{{ name }}</td>
          <td>{{ rule[j] }}</td>
        </tr>
      </tbody>
    </table>
  </form>
</template>
