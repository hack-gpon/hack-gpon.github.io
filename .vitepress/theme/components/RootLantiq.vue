<script setup lang="ts">
import { reactive } from 'vue'
import { lantiqRootUboot, unlockHuaweiShell } from '../lib/rootLantiq.js'
import SerialModal from './SerialModal.vue'
import StepStatus from './StepStatus.vue'

/** Web Serial root procedure for Lantiq based sticks. */
const props = withDefaults(
  defineProps<{
    modelName: string
    unlockHuaweiShell?: boolean
    label?: string
    procedure?: string
  }>(),
  { unlockHuaweiShell: false, label: 'Start root!', procedure: 'web-root' }
)

type State = 'pause' | 'loading' | 'error' | 'success'
const steps = reactive<{ state: State; text: string }[]>([])

function set(i: number, state: State, text: string) {
  steps[i] = { state, text }
}

async function root() {
  steps.splice(0, steps.length)
  set(0, 'loading', 'Waiting for the user to choose the port')
  if (props.unlockHuaweiShell) set(1, 'pause', '')

  let port: any
  try {
    port = await (navigator as any).serial.requestPort()
  } catch (err) {
    set(0, 'error', `Error: ${(err as Error).message}`)
    return
  }

  let result = await lantiqRootUboot(
    port,
    props.modelName,
    (msg: string) => set(0, 'loading', msg),
    (err: string) => {
      set(0, 'error', err)
      console.log(err)
    }
  )
  if (!result) return
  set(0, 'success', 'Congratulations! Step completed.')

  if (props.unlockHuaweiShell) {
    result = await unlockHuaweiShell(
      port,
      (msg: string) => set(1, 'loading', msg),
      (err: string) => {
        set(1, 'error', err)
        console.log(err)
      }
    )
    if (result) set(1, 'success', 'Congratulations! Step completed.')
  }
}
</script>

<template>
  <SerialModal :label="label" title="Root status" :procedure="procedure" @open="root">
    <div class="steps">
      <StepStatus v-for="(step, i) in steps" :key="i" :title="`Step ${i + 1}`" :state="step.state" :text="step.text" />
    </div>
  </SerialModal>
</template>

<style scoped>
.steps {
  display: flex;
  gap: 16px;
}
</style>
