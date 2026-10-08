<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import AsideSpecs from './components/AsideSpecs.vue'
import NotFound from './components/NotFound.vue'
import PageHeader from './components/PageHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <PageHeader />
    </template>
    <template #aside-outline-before>
      <AsideSpecs />
    </template>
    <template #doc-after>
      <SiteFooter />
    </template>
    <template #not-found>
      <NotFound />
    </template>
  </DefaultTheme.Layout>
</template>
