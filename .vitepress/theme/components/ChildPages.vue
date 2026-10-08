<script setup lang="ts">
import { useData, withBase, type DefaultTheme } from 'vitepress'
import { computed } from 'vue'

/**
 * "Table of contents" of the pages with `has_children` (as Just the Docs did): the child pages,
 * taken from the sidebar so they have the same order and the same `nav_exclude`.
 */
const { page, theme } = useData()

function find(items: DefaultTheme.SidebarItem[], url: string): DefaultTheme.SidebarItem | undefined {
  for (const item of items) {
    if (item.link === url) return item
    const found = item.items && find(item.items, url)
    if (found) return found
  }
}

const children = computed(() => {
  if (!page.value.frontmatter.has_children) return []
  const url = '/' + page.value.relativePath.replace(/(^|\/)index\.md$/, '$1')
  const sidebar = theme.value.sidebar as DefaultTheme.SidebarItem[]
  return find(sidebar, url)?.items ?? []
})
</script>

<template>
  <nav v-if="children.length" class="child-pages vp-doc" aria-labelledby="child-pages-title">
    <h2 id="child-pages-title">Table of contents</h2>
    <ul>
      <li v-for="child in children" :key="child.link">
        <a :href="withBase(child.link!)">{{ child.text }}</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.child-pages {
  margin-top: 32px;
}
</style>
