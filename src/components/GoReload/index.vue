<template>
  <div class="go-reload"></div>  
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import router from '@/router'
// 重新加载前路径页面
onMounted(() => {
  router.go(-1)
})
</script>

<style lang="scss" scoped>
@include go('reload') {
  height: 100vh;
  width: 100vw;
  @include fetch-bg-color('background-color')
}
</style>
