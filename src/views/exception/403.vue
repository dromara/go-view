<template>
  <div class="go-error">
    <div class="text-center">
      <img src="~@/assets/images/exception/403.svg" alt="" />
    </div>
    <div class="text-center">
      <h1 class="text-base text-gray-500">抱歉，你无权访问该页面</h1>
      <n-button type="info" @click="goHome">回到首页</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PageEnum } from '@/enums/pageEnum'
import { routerTurnByName } from '@/utils'
function goHome() {
  routerTurnByName(PageEnum.BASE_HOME_NAME)
}
</script>

<style lang="scss" scoped>
@include go(error) {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 100px 0;
  .text-center {
    h1 {
      color: #666;
      padding: 20px 0;
    }
  }

  img {
    width: 350px;
    margin: 0 auto;
  }
}
</style>
