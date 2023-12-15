<script setup lang="ts">
import type { BuiltinLanguage, BuiltinTheme } from 'shikiji'
import { onMounted, ref, watch } from 'vue'

const lang = ref<BuiltinLanguage>('typescript')
const theme = ref<BuiltinTheme>('vitesse-dark')
const input = ref('')
const output = ref('')
const loading = ref(true)

onMounted(async () => {
  const { getHighlighter } = await import('shikiji')
  const highlighter = await getHighlighter({
    themes: [theme.value],
    langs: ['typescript', 'javascript', 'json', 'html', 'css', 'markdown', lang.value as any],
  })

  watch(input, run, { immediate: true })

  watch([lang, theme], async () => {
    loading.value = true
    await Promise.all([
      highlighter.loadTheme(theme.value),
      highlighter.loadLanguage(lang.value as any),
    ])
    run()
  })

  function run() {
    output.value = highlighter.codeToHtml(input.value, {
      lang: lang.value,
      theme: theme.value,
    })
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div grid="~ cols-2">
      <textarea v-model="input" />
      <div v-html="output" />
    </div>
  </div>
</template>
