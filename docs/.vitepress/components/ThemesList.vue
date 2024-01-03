<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePlayground } from '../store/playground'

const play = usePlayground()
const showModel = ref(false)

function preview(id: string) {
  play.theme = id
  showModel.value = true
}

watch(showModel, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="l in play.allThemes" :key="l.id">
          <td>{{ l.displayName }}</td>
          <td><code>{{ l.id }}</code></td>
          <td>
            <div flex>
              <button
                title="Preview Example"
                ma text-lg
                @click="preview(l.id)"
              >
                <div i-carbon:code />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showModel" fixed inset-0 z-100 flex items-center justify-center>
      <div bg-black:50 absolute inset-0 backdrop-blur-sm @click="showModel = false" />
      <MiniPlayground h-90vh w-90vw lg:w-60vw lg:h-80vh />
    </div>
  </div>
</template>
