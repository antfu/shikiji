<script setup lang='ts'>
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { usePlayground } from '../store/playground'

const visible = ref(false)
function toggleVisible() {
  visible.value = !visible.value
}

const play = usePlayground()
const currentThemeType = computed(() => play.allThemes.find(i => i.id === play.theme)?.type || 'inherit')

const asideRef = ref<HTMLElement>()
onClickOutside(asideRef, (e: Event) => {
  const isExclude = (e.target as HTMLElement).classList?.contains('click-exclude')
  if (visible.value && !isExclude)
    visible.value = false
})
</script>

<template>
  <div class="mini-playground" my-5 relative of-hidden text-sm rounded-lg :class="currentThemeType" :style="[play.preStyle]">
    <Selector ref="asideRef" v-model="visible" />
    <header px-3 h-10 flex items-center justify-between border="b gray/20">
      <span text-gray mr-3 cursor-pointer class="click-exclude" :class="visible ? 'i-line-md-menu-fold-left' : 'i-line-md-menu-fold-right'" @click="toggleVisible" />
      <div flex gap-10 text-xs>
        <span cursor-pointer class="click-exclude" @click="toggleVisible">{{ play.langName }}</span>
        <span cursor-pointer class="click-exclude" @click="toggleVisible">{{ play.themeName }}</span>
      </div>
      <div flex items-center gap-3>
        <div i-svg-spinners-3-dots-fade :class="play.isLoading ? 'op100' : 'op0'" flex-none transition-opacity />
        <div op50 text-xs mx-2 class="hidden md:block!">
          Playground
        </div>
        <button title="Randomize" hover="bg-gray/10" p1 rounded @click="play.randomize">
          <div i-carbon:shuffle op50 />
        </button>
      </div>
    </header>

    <!-- input and output -->
    <div grid="~ md:cols-2" class="lt-md:of-x-auto" style="height: calc(100% - 40px);">
      <CodeMirror v-model="play.input" border="lt-md:b  gray/20" class="of-y-none md:of-y-auto" />
      <div class="output" border="l gray/20" min-h-100 text-sm h-full v-html="play.output" />
    </div>
  </div>
</template>

<style lang="scss">
@import '@unocss/reset/tailwind-compat.css';
.mini-playground {
  .output pre {
    overflow: auto !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 10px !important;
  }
  @media (max-width: 768px) {
    .output pre {
      height: auto !important;
    }
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-thumb:vertical,
  ::-webkit-scrollbar-thumb:horizontal {
    border-radius: 6px;
  }
  &.light {
    box-shadow: 0 0 3px #ddd;
    ::-webkit-scrollbar-thumb:vertical,
    ::-webkit-scrollbar-thumb:horizontal {
      background-color: #ccc;
    }
  }
  &.dark {
    box-shadow: 0 0 3px #dddddd8a;
    ::-webkit-scrollbar-thumb:vertical,
    ::-webkit-scrollbar-thumb:horizontal {
      background-color: #cccccc5b;
    }
  }
}
</style>
