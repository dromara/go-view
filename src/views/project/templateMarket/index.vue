<template>
  <div class="go-project-template-market">
    <n-space vertical>
      <n-image object-fit="contain" height="300" preview-disabled :src="requireErrorImg()"></n-image>
      <n-h3>暂时还没有东西呢</n-h3>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { requireErrorImg } from '@/utils'
</script>

<style lang="scss" scoped>
@include go("project-template-market") {
  margin-top: 100px;
  @extend .go-flex-center;
}
</style>
