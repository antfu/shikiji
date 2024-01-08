<script setup>
</script>

<template>
  <div class="container max-w-1282px mxa  my-10 min-h-150 vp-doc rounded-lg" of-hidden>
    <MiniPlayground />
  </div>
</template>

<style scoped lang="scss">
.container {
  @media (max-width: 640px) {
    padding: 24px;
  }
  @media (min-width: 640px) {
    padding: 0 48px;
  }
  @media (min-width: 960px) {
    padding: 0 64px;
  }
}
</style>
