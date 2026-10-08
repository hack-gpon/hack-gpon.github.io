<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed, onMounted, ref, watch } from 'vue'

const { frontmatter, page } = useData()

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

async function loadContributors() {
  contributors.value = null
  contributorsError.value = false
  showContributors.value = false
  if (redirect.value || !page.value.filePath) return
  try {
    contributors.value = await authorsOf(page.value.filePath, new Set())
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
    <h1>{{ frontmatter.title ?? page.title }}</h1>
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
