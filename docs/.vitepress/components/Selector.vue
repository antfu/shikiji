<script setup lang='ts'>
import { useVModel } from '@vueuse/core'

import { usePlayground } from '../store/playground'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const visible = useVModel(props, 'modelValue', emit)

const play = usePlayground()
function getThemesByType(type: 'light' | 'dark') {
  return play.allThemes.filter(i => i.type === type)
}

function isActive(id: string, value: string) {
  return id === value ? 'text-green font-semibold' : ''
}
</script>

<template>
  <div
    bg-white:10 backdrop-blur-sm
    absolute top-10 z-10 flex transition-all duration-200 lt-md:w-full of="x-auto y-hidden"
    style="height: calc(100% - 40px);" :class="visible ? 'translate-x-0 shadow-lg' : '-translate-x-full'"
  >
    <div flex-1 h-full>
      <div relative h-10 flex items-center mt-2 p="l-5 r-1.5">
        <input
          v-model.trim="play.langFilter"
          type="text" placeholder="search language..."
          class="search-input"
        >
        <span
          class="i-line-md:close-small top-1/2 -translate-y-1/2"
          text-gray inline-block w-4 h-4 absolute right-2 cursor-pointer
          @click="play.langFilter = ''"
        />
      </div>
      <ul of-auto class="my-0! py3 pb6" style="height: calc(100% - 40px);">
        <li
          v-for="lang in play.allLanguages" :key="lang.id" list-none cursor-pointer :title="lang.name"
          :class="isActive(lang.id, play.lang)" @click="play.lang = lang.id"
        >
          {{ lang.name }}
        </li>
      </ul>
    </div>
    <div flex-1 h-full>
      <div relative h-10 flex items-center mt-2 p="l-5 r-1.5">
        <input
          v-model.trim="play.themeFilter"
          type="text" placeholder="search theme..." class="search-input"
        >
        <span
          class="i-line-md:close-small top-1/2 -translate-y-1/2"
          text-gray inline-block w-4 h-4 absolute right-2 cursor-pointer
          @click="play.themeFilter = ''"
        />
      </div>
      <ul h-full of-auto border="l gray/20" class="!my-0 py3 pb6" style="height: calc(100% - 40px);">
        <li
          v-for="theme in getThemesByType('light')" :key="theme.id" list-none cursor-pointer :title="theme.displayName"
          :class="isActive(theme.id, play.theme)" @click="play.theme = theme.id"
        >
          {{ theme.displayName }}
        </li>
        <div border="b green/50" my-3 class="-translate-x-3" />
        <li
          v-for="theme in getThemesByType('dark')" :key="theme.id" list-none cursor-pointer :title="theme.displayName"
          :class="theme.id === play.theme ? 'text-green font-semibold' : ''" @click="play.theme = theme.id"
        >
          {{ theme.displayName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang='scss'>

</style>
