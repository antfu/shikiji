import type { Ref, WritableComputedRef } from 'vue'
import { unref, watch } from 'vue'
import type { EditorViewConfig } from '@codemirror/view'
import { EditorView } from 'codemirror'
import type { MaybeRef } from '@vueuse/core'

export function useCodeMirror(
  parent: Ref<HTMLElement | null | undefined>,
  input: Ref<string> | WritableComputedRef<string>,
  options: MaybeRef<EditorViewConfig & { mode?: string }> = {},
) {
  let skip = false
  const cm = new EditorView(
    {
      parent: parent.value as Element,
      doc: input.value,
      dispatch(tr) {
        cm.update([tr])
        if (tr.docChanged) {
          if (skip) {
            skip = false
            return
          }
          input.value = cm.state.doc.toString()
        }
      },
      ...unref(options),
    },
  )

  watch(
    input,
    (v) => {
      if (v !== cm.state.doc.toString()) {
        skip = true
        cm.dispatch({
          changes: { from: 0, to: cm.state.doc.length, insert: v },
        })
      }
    },
    { immediate: true },
  )

  return cm
}
