<template>
  <div class="go-redirect">
    <n-empty description="你什么也找不到">
      <template #extra>
        <n-button size="small" @click="goHome">看看别的</n-button>
      </template>
    </n-empty>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const goHome = () => {
  router.replace({ path: '/' })
}
</script>
<style lang="scss" scoped>
@include go(redirect) {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 100px 0;
  @include background-image('background-image');
}
</style>
