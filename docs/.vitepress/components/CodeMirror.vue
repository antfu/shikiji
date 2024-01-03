<script setup lang="ts">
import { useEventListener, useThrottleFn, useVModel } from '@vueuse/core'
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import { useCodeMirror } from '../codemirror'

const props = defineProps<{
  modelValue: string
  mode?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', payload: string): void }>()

const el = ref<HTMLElement>()
const input = useVModel(props, 'modelValue', emit, { passive: true })

onMounted(async () => {
  const cm = useCodeMirror(el, input, reactive({
    ...toRefs(props),
  }))

  useEventListener(cm.contentDOM.parentElement, 'scroll', useThrottleFn(() => {
    cm.requestMeasure()
  }, 50, true))

  const timer: any = 0
  watch(() => [props.modelValue], async () => {
    clearTimeout(timer)
  }, { immediate: true })
})
</script>

<template>
  <div
    ref="el"
    relative
    font-mono
    text-sm
    data-enable-grammarly="false"
    h-full
  />
</template>

<style>
.cm-editor {
  height: 100% !important;
  width: 100% !important;
}
.cm-content {
  padding: 10px !important;
}
.mini-playground.dark .cm-line {
  caret-color: #ccc !important;
}
</style>
