<template>
  <div
    class="go-content-layers-list-item"
    :class="{ hover: hover, select: select }"
  >
    <div class="go-flex-center item-content">
      <n-image
        class="list-img"
        object-fit="contain"
        preview-disabled
        :src="image"
        :fallback-src="requireErrorImg()"
     ></n-image>
      <n-ellipsis>
        <n-text class="list-text" :depth="2">
          {{ props.componentData.chartConfig.title }}
        </n-text>
      </n-ellipsis>
    </div>
    <div :class="{ 'select-modal': select }"></div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'
import { requireErrorImg } from '@/utils'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'

// 全局颜色
const designStore = useDesignStore()
const chartEditStore = useChartEditStore()

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})

const props = defineProps({
  componentData: {
    type: Object,
    required: true
  }
})

const { image } = toRefs(props.componentData.chartConfig)

// 计算当前选中目标
const select = computed(() => {
  const id = props.componentData.id
  return chartEditStore.getTargetChart.selectId.find((e: string) => e === id)
})

const hover = computed(() => {
  return props.componentData.id === chartEditStore.getTargetChart.hoverId
})
</script>

<style lang="scss" scoped>
$centerHeight: 52px;
$textSize: 10px;

@include go(content-layers-list-item) {
  position: relative;
  height: $centerHeight;
  width: 90%;
  margin: 5px 5%;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0);
  @extend .go-transition-quick;
  &.hover,
  &:hover {
    @include fetch-bg-color('background-color4');
  }
  /* 选中 */
  &.select {
    border: 1px solid v-bind('themeColor');
    /* 需要设置最高级，覆盖 hover 的颜色 */
    background-color: rgba(0, 0, 0, 0);
    .list-img {
      border:1px solid v-bind('themeColor')!important;
    }
  }
  .select-modal,
  .item-content {
    position: absolute;
    top: 0;
    left: 0;
  }
  .item-content {
    z-index: 1;
    padding: 6px 5px;
    justify-content: start !important;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
  }
  .select-modal {
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background-color: v-bind('themeColor');
  }
  .list-img {
    flex-shrink: 0;
    height: $centerHeight;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid;
    padding: 2px;
    @include hover-border-color('hover-border-color');
  }
  .list-text {
    padding-left: 6px;
    font-size: $textSize;
  }
}
</style>
