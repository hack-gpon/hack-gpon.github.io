<script setup lang="ts">
import { useData } from 'vitepress'

/** "Hardware Specifications" table of the page, shown in the aside above the outline. */
const { page } = useData()
</script>

<template>
  <div v-if="page.hardwareSpecs" class="aside-specs">
    <p class="title">Hardware Specifications</p>
    <div class="vp-doc" v-html="page.hardwareSpecs" />
  </div>
</template>

<style scoped>
.aside-specs {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.title {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 32px;
}

.aside-specs :deep(table) {
  display: table;
  width: 100%;
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  table-layout: fixed;
}

.aside-specs :deep(thead) {
  display: none;
}

.aside-specs :deep(td) {
  padding: 4px 6px;
  overflow-wrap: anywhere;
  vertical-align: top;
}

.aside-specs :deep(td:first-child) {
  width: 40%;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.aside-specs :deep(code) {
  font-size: 11px;
}

.aside-specs :deep(tr:has(td:last-child:empty)) {
  display: none;
}

.aside-specs :deep(tr:nth-child(2n)) {
  background-color: transparent;
}
</style>
