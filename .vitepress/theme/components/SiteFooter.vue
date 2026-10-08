<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <footer class="site-footer">
    Copyright &copy; 2022-{{ new Date().getFullYear() }}. The documentation hereby found is distributed under the terms of the
    <a href="https://github.com/hack-gpon/hack-gpon.github.io/blob/main/LICENSE">MIT License</a>. Any external
    reference, link or software retains its original license and is not under the control of this website.
    <a :href="withBase('/privacy-policy/')">Privacy Policy</a>.
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 12px;
  line-height: 20px;
  color: var(--vp-c-text-2);
}

a {
  color: var(--vp-c-brand-1);
}
</style>
