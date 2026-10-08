<script setup lang="ts">
/** Animated status of a step of a Web Serial procedure. */
defineProps<{
  title: string
  state: 'pause' | 'loading' | 'error' | 'success'
  text: string
}>()
</script>

<template>
  <div class="animated" :class="state">
    <p>{{ title }}</p>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
      <circle class="path circle" fill="none" stroke="currentColor" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
      <polyline class="path check success" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
      <line class="path line error" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
      <line class="path line error" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
      <line class="path line pause" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="49.4" y1="37.9" x2="49.4" y2="92.3" />
      <line class="path line pause" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="80.8" y1="38" x2="80.8" y2="92.2" />
    </svg>
    <p class="text">{{ text }}</p>
  </div>
</template>

<style scoped>
.animated {
  flex: 1;
}

.animated p {
  margin: 20px 0;
  text-align: center;
  font-size: 1.1em;
}

.animated svg {
  display: block;
  width: 100px;
  margin: 24px auto 0;
}

.pause .success,
.pause .error,
.success .error,
.success .pause,
.error .success,
.error .pause,
.loading .success,
.loading .error,
.loading .pause {
  display: none;
}

.success {
  color: var(--vp-c-green-1);
}

.error {
  color: var(--vp-c-red-1);
}

.path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
}

.path.circle {
  animation: dash 0.9s ease-in-out;
}

.path.line {
  stroke-dashoffset: 1000;
  animation: dash 0.9s 0.35s ease-in-out forwards;
}

.path.check {
  stroke-dashoffset: -100;
  animation: dash-check 0.9s 0.35s ease-in-out forwards;
}

.loading .path {
  stroke-dasharray: 269%;
  stroke-dashoffset: 0;
  animation: loading 1s cubic-bezier(1, 1, 1, 1) 0s infinite;
  transform-origin: 50% 50%;
}

@keyframes loading {
  0% {
    stroke-dasharray: 44% 269%;
    stroke-dashoffset: 0%;
  }
  50% {
    stroke-dasharray: 156%;
    stroke-dashoffset: 156%;
  }
  100% {
    stroke-dasharray: 44% 269%;
    stroke-dashoffset: 314%;
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes dash-check {
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
}
</style>
