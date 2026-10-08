<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed, onMounted, ref, watch } from 'vue'

const { frontmatter, page, theme } = useData()

const editUrl = computed(() => theme.value.editLink?.pattern.replace(':path', page.value.filePath))

const redirect = computed<string | undefined>(() => {
  const target: string | undefined = frontmatter.value.redirect_to
  return target && !target.endsWith('/') ? target + '/' : target
})

interface Contributor {
  login: string
  name?: string
  html_url: string
  avatar_url: string
}

const contributors = ref<Contributor[] | null>(null)
const contributorsError = ref(false)
const showContributors = ref(false)

const api = 'https://api.github.com/repos/hack-gpon/hack-gpon.github.io/commits'

async function fetchCommits(path: string) {
  const response = await fetch(`${api}?path=${encodeURIComponent(path)}`)
  if (!response.ok) throw new Error(response.statusText)
  return response.json()
}

/** Authors of the commits of a file, following its renames. */
async function authorsOf(path: string, scanned: Set<string>): Promise<Contributor[]> {
  scanned.add(path)
  const commits = await fetchCommits(path)
  const authors: Contributor[] = commits
    .flatMap((c: any) => [
      { ...c.commit.author, ...c.author },
      { ...c.commit.committer, ...c.committer }
    ])
    .filter((a: Contributor) => a.login && a.login !== 'web-flow')

  const first = commits[commits.length - 1]
  if (first) {
    const details = await (await fetch(first.url)).json()
    const renamed = details.files?.find((f: any) => f.filename === path && f.status === 'renamed')
    if (renamed && !scanned.has(renamed.previous_filename)) {
      authors.push(...(await authorsOf(renamed.previous_filename, scanned)))
    }
  }
  return authors.filter((a, i, all) => all.findIndex((b) => b.login === a.login) === i)
}

/** Path of the page in the Jekyll version of the site (e.g. `ont/x.md` -> `_ont/x.md`). */
const jekyllDirs: Record<string, string> = {
  ont: '_ont',
  'ont-xgs': '_ont_xgs',
  'ont-epon': '_ont_epon',
  router: '_router_pon',
  tools: '_tools',
  sfp: '_sfp',
  gpon: '_gpon',
  'sfp-cage': '_sfp_cage'
}

function jekyllPath(path: string) {
  const [dir, ...rest] = path.split('/')
  return jekyllDirs[dir] && rest.length ? [jekyllDirs[dir], ...rest].join('/') : undefined
}

async function loadContributors() {
  contributors.value = null
  contributorsError.value = false
  showContributors.value = false
  const path = page.value.filePath
  if (redirect.value || !path) return
  // the GitHub API allows 60 requests per hour without authentication
  const cacheKey = `contributors:${path}`
  try {
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      contributors.value = JSON.parse(cached)
      return
    }
  } catch {}
  try {
    const scanned = new Set<string>()
    const authors = await authorsOf(path, scanned)
    const legacy = jekyllPath(path)
    if (legacy && !scanned.has(legacy)) authors.push(...(await authorsOf(legacy, scanned)))
    const unique = authors
      .filter((a, i, all) => all.findIndex((b) => b.login === a.login) === i)
      .map(({ login, name, html_url, avatar_url }) => ({ login, name, html_url, avatar_url }))
    if (page.value.filePath !== path) return
    contributors.value = unique
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(unique))
    } catch {}
  } catch {
    contributorsError.value = true
  }
}

onMounted(() => {
  if (redirect.value) {
    window.location.replace(withBase(redirect.value))
    return
  }
  loadContributors()
})

watch(() => page.value.filePath, loadContributors)
</script>

<template>
  <header class="page-header">
    <h1>
      {{ frontmatter.title ?? page.title }}
      <a v-if="editUrl" class="edit-link" :href="editUrl" target="_blank" rel="noopener" :title="theme.editLink.text" :aria-label="theme.editLink.text">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z" /></svg>
      </a>
    </h1>
    <p v-if="frontmatter.alias" class="alias"><span>Also sold as:</span> {{ frontmatter.alias }}</p>
    <p v-if="frontmatter.description" class="description">{{ frontmatter.description }}</p>
    <p v-if="redirect">
      This page has moved to <a :href="withBase(redirect)">{{ redirect }}</a>.
    </p>
    <div v-else-if="contributors?.length || contributorsError" class="contributors">
      <button v-if="contributors" type="button" @click="showContributors = !showContributors">
        {{ contributors.length }} {{ contributors.length === 1 ? 'Contributor' : 'Contributors' }}
      </button>
      <span v-else>Sorry, the list of contributors is not currently available</span>
      <ul v-if="showContributors && contributors">
        <li v-for="c in contributors" :key="c.login">
          <a :href="c.html_url" target="_blank" rel="noopener">
            <img class="avatar" :src="c.avatar_url" alt="" />
            <span>{{ c.name || c.login }}</span>
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

h1 {
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -0.02em;
}

/* like the "#" anchor of the headings: visible on hover */
.edit-link {
  display: inline-flex;
  margin-left: 8px;
  vertical-align: middle;
  color: var(--vp-c-brand-1);
  opacity: 0;
  transition: color 0.25s, opacity 0.25s;
}

.edit-link svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

h1:hover .edit-link,
.edit-link:focus {
  opacity: 1;
}

.edit-link:hover {
  color: var(--vp-c-brand-2);
}

@media (hover: none) {
  .edit-link {
    opacity: 1;
  }
}

.alias {
  margin-top: 8px;
  font-size: 18px;
}

.alias span {
  font-weight: 300;
}

.description {
  margin-top: 8px;
  font-size: 18px;
  color: var(--vp-c-text-2);
}

.contributors {
  margin-top: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.contributors button {
  color: var(--vp-c-brand-1);
}

.contributors ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 8px;
  padding: 0;
  list-style: none;
}

.contributors a {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-1);
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
</style>
