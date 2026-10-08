<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { frontmatter, page } = useData()

const url = computed(() => '/' + page.value.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, ''))
</script>

<template>
  <code>{{ frontmatter.title }}, Hack GPON. Available at: https://hack-gpon.org{{ url }}</code>
</template>
