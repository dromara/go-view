<template>
  <!-- svg加载图 -->
  <div class="go-loading-svg go-flex-center">
    <img src="~@/assets/images/tips/loadingSvg.svg" alt="" />
  </div>
</template>
<style lang="scss" scoped>
@include go('loading-svg') {
  width: 100%;
  height: 100%;
  background-color: transparent;
  img {
    height: 50px;
  }
}
</style>
