<script setup lang="ts">
import { ref } from 'vue'
import { hisensePloam } from '../lib/hisensePloam'

const ploam = ref('')
const result = ref('')
const validated = ref(false)

function encode(event: Event) {
  validated.value = true
  if (!(event.target as HTMLFormElement).checkValidity()) return
  result.value = hisensePloam(ploam.value)
}
</script>

<template>
  <form class="hg-form" :class="{ validated }" novalidate @submit.prevent="encode">
    <label>
      <span>PLOAM in ASCII format</span>
      <input v-model="ploam" type="text" placeholder="PLOAM in ASCII" required />
      <small class="invalid">Please provide a valid PLOAM password.</small>
    </label>
    <div class="actions">
      <button type="submit" class="btn btn-primary">Encode!</button>
    </div>
    <div v-if="result" class="language-txt vp-adaptive-theme"><pre><code>{{ result }}</code></pre></div>
  </form>
</template>
