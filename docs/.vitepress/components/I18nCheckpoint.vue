<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import checkpoint_file from '../i18n-checkpoint.json'
import checkpoint_string_file from '../i18n-checkpoint-string.json'

const ORIGINAL_LANG = 'root'

interface CheckpointData {
  [key: string]: {
    hash: string
    date: string
  }
}

interface CheckpointString {
  [key: string]: {
    title: string
    hash: string
    date: string
  }
}

interface Label {
  enable: boolean
  hash?: string
  hashString?: string
  hashLink?: string
  date?: string
  dateString?: string
  titleString?: string
}

const checkpointData: CheckpointData = checkpoint_file

const checkpointString: CheckpointString = checkpoint_string_file

const { site } = useData()
const label = computed<Label>(() => {
  const localeIndex = site.value.localeIndex
  // disable when localeIndex missing or in the original lang or the checkpoint doesn't exist
  if (!localeIndex || localeIndex === ORIGINAL_LANG || !checkpointData[localeIndex])
    return { enable: false }
  const { hash, date } = checkpointData[localeIndex]
  const { hash: hashString, date: dateString, title: titleString } = checkpointString[localeIndex]
  const hashLink = `https://github.com/antfu/shikiji/commit/${hash}`
  return { enable: true, hash, hashString, hashLink, date, dateString, titleString }
})
</script>

<template>
  <div v-if="label.enable" id="translation-checkpoint-container">
    <p id="translation-checkpoint-title">
      {{ label.titleString }}
    </p>
    <div id="translation-checkpoint-p">
      <p>
        {{ label.hashString }}
        <a id="translation-checkpoint-hash-link" :href="label.hashLink">{{ label.hash }}</a>
      </p>
      <p>
        {{ label.dateString }}
        {{ label.date }}
      </p>
    </div>
  </div>
</template>

<style scoped>
#translation-checkpoint-container {
  background-color: var(--vp-c-gray-soft);
  font-size: var(--vp-custom-block-font-size);
  border-radius: 8px;
  margin-top: 32px;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 18px;
}

#translation-checkpoint-title {
  font-size: var(--vp-custom-block-font-size);
  font-weight: bold;
  margin-bottom: 4px;
}

#translation-checkpoint-hash-link {
  font-weight: bold;
  text-decoration-line: underline;
}
</style>
