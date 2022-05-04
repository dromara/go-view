<template>
  <div class="go-content-charts-item-box">
    <!-- 每一项组件的渲染 -->
    <div
      class="item-box"
      v-for="(item, index) in menuOptions"
      :key="index"
      draggable
      @dragstart="dragStartHandle($event, item)"
      @dragend="dragendHandle"
    >
      <div class="list-header">
        <mac-os-control-btn :mini="true" :disabled="true"></mac-os-control-btn>
        <n-text class="list-header-text" depth="3">{{ item.title }}</n-text>
      </div>
      <div class="list-center go-flex-center">
        <img class="list-img" v-lazy="item.image" alt="图表图片" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { MacOsControlBtn } from '@/components/Tips/MacOsControlBtn/index'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasTypeEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { componentInstall } from '@/utils'
import { DragKeyEnum } from '@/enums/editPageEnum'
import { ConfigType } from '@/packages/index.d'
import { fetchConfigComponent, fetchChartComponent } from '@/packages/index'
import omit from 'lodash/omit'
const chartEditStore = useChartEditStore()

defineProps({
  menuOptions: {
    type: Array as PropType<ConfigType[]>,
    default: () => []
  }
})

// 拖拽处理
const dragStartHandle = (e: DragEvent, item: ConfigType) => {
  // 动态注册图表组件
  componentInstall(item.chartKey, fetchChartComponent(item))
  componentInstall(item.conKey, fetchConfigComponent(item))
  // 将配置项绑定到拖拽属性上
  e!.dataTransfer!.setData(DragKeyEnum.DROG_KEY, JSON.stringify(omit(item, ['image'])))
  // 修改状态
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, true)
}

// 拖拽结束
const dragendHandle = () => {
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, false)
}
</script>

<style lang="scss" scoped>
/* 列表项宽度 */
$itemWidth: 86%;
/* 内容高度 */
$centerHeight: 100px;
@include go('content-charts-item-box') {
  .item-box {
    margin: 0 7%;
    margin-bottom: 15px;
    width: $itemWidth;
    overflow: hidden;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0);
    @include fetch-bg-color('background-color2');
    @extend .go-transition;
    &:hover {
      @include hover-border-color('background-color4');
      .list-img {
        transform: scale(1.1);
      }
    }
    .list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 15px;
      @include fetch-bg-color('background-color3');
      &-text {
        font-size: 12px;
        margin-left: 8px;
      }
    }
    .list-center {
      padding: 6px 0;
      height: $centerHeight;
      overflow: hidden;
      .list-img {
        height: 100%;
        border-radius: 6px;
        @extend .go-transition;
      }
    }
  }
}
</style>
