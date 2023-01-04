<template>
  <div class="go-error">
    <div class="text-center">
      <img src="~@/assets/images/exception/500.svg" alt="" />
    </div>
    <div class="text-center">
      <h1 class="text-base text-gray-500">抱歉，服务器出错了，建议您重新登录呢</h1>
    </div>
    <n-button type="primary" secondary @click="goLogin">重新登录</n-button>
  </div>
</template>

<script lang="ts" setup>
import { PageEnum } from '@/enums/pageEnum'
import { routerTurnByName } from '@/utils'

function goLogin() {
  routerTurnByName(PageEnum.BASE_LOGIN_NAME)
}
</script>

<style lang="scss" scoped>
@include go(error) {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 100px 0;
  @include background-image('background-image');
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
