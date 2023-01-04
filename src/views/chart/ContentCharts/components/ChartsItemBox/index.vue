<template>
  <div class="go-content-charts-item-animation-patch">
    <div
      ref="contentChartsItemBoxRef"
      class="go-content-charts-item-box"
      :class="[chartMode === ChartModeEnum.DOUBLE ? 'double' : 'single']"
    >
      <!-- 每一项组件的渲染 -->
      <div
        class="item-box"
        v-for="(item, index) in menuOptions"
        :key="index"
        draggable
        @dragstart="dragStartHandle($event, item)"
        @dragend="dragendHandle"
        @dblclick="dblclickHandle(item)"
      >
        <div class="list-header">
          <mac-os-control-btn class="list-header-control-btn" :mini="true" :disabled="true"></mac-os-control-btn>
          <n-text class="list-header-text" depth="3">
            <n-ellipsis>{{ item.title }}</n-ellipsis>
          </n-text>
        </div>
        <div class="list-center go-flex-center go-transition">
          <img class="list-img" v-lazy="item.image" alt="图表图片" />
        </div>
        <div class="list-bottom">
          <n-text class="list-bottom-text" depth="3">
            <n-ellipsis style="max-width: 90%">{{ item.title }}</n-ellipsis>
          </n-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, watch, ref, Ref, computed, nextTick } from 'vue'
import { MacOsControlBtn } from '@/components/Tips/MacOsControlBtn/index'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasTypeEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { ChartModeEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore'
import { componentInstall, loadingStart, loadingFinish, loadingError } from '@/utils'
import { DragKeyEnum } from '@/enums/editPageEnum'
import { createComponent } from '@/packages'
import { ConfigType, CreateComponentType } from '@/packages/index.d'
import { fetchConfigComponent, fetchChartComponent } from '@/packages/index'
import omit from 'lodash/omit'
const chartEditStore = useChartEditStore()

defineProps({
  menuOptions: {
    type: Array as PropType<ConfigType[]>,
    default: () => []
  }
})

const chartLayoutStore = useChartLayoutStore()
const contentChartsItemBoxRef = ref()

// 组件展示状态
const chartMode: Ref<ChartModeEnum> = computed(() => {
  return chartLayoutStore.getChartType
})

// 拖拽处理
const dragStartHandle = (e: DragEvent, item: ConfigType) => {
  // 动态注册图表组件
  componentInstall(item.chartKey, fetchChartComponent(item))
  componentInstall(item.conKey, fetchConfigComponent(item))
  // 将配置项绑定到拖拽属性上
  e!.dataTransfer!.setData(DragKeyEnum.DRAG_KEY, JSON.stringify(omit(item, ['image'])))
  // 修改状态
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, true)
}

// 拖拽结束
const dragendHandle = () => {
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, false)
}

// 双击添加
const dblclickHandle = async (item: ConfigType) => {
  try {
    loadingStart()
    // 动态注册图表组件
    componentInstall(item.chartKey, fetchChartComponent(item))
    componentInstall(item.conKey, fetchConfigComponent(item))
    // 创建新图表组件
    let newComponent: CreateComponentType = await createComponent(item)
    // 添加
    chartEditStore.addComponentList(newComponent, false, true)
    // 选中
    chartEditStore.setTargetSelectChart(newComponent.id)
    loadingFinish()
  } catch (error) {
    loadingError()
    window['$message'].warning(`图表正在研发中, 敬请期待...`)
  }
}

watch(
  () => chartMode.value,
  (newValue: ChartModeEnum) => {
    if (newValue === ChartModeEnum.DOUBLE) {
      nextTick(() => {
        contentChartsItemBoxRef.value.classList.add('miniAnimation')
      })
    }
  }
)
</script>

<style lang="scss" scoped>
/* 列表项宽度 */
$itemWidth: 100%;
$maxItemWidth: 180px;
$halfItemWidth: 46%;
/* 内容高度 */
$centerHeight: 100px;
$halfCenterHeight: 50px;

@include go('content-charts-item-animation-patch') {
  padding: 10px;
}

@include go('content-charts-item-box') {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 9px;
  transition: all 0.7s linear;
  .item-box {
    margin: 0;
    width: $itemWidth;
    overflow: hidden;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0);
    @include fetch-bg-color('background-color2');
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
        height: 100px;
        width: 140px;
        border-radius: 6px;
        @extend .go-transition;
      }
    }
    .list-bottom {
      display: none;
      .list-bottom-text {
        font-size: 12px;
        padding-left: 5px;
      }
    }
  }
  &.single {
    .item-box {
      @extend .go-transition;
    }
  }
  &.double {
    .list-header {
      padding: 2px 5px;
      .list-header-text {
        display: none;
      }
      .list-header-control-btn {
        transform: scale(0.7);
      }
    }
    .item-box {
      width: $halfItemWidth;
      max-width: $maxItemWidth;
    }
    .list-center {
      height: $halfCenterHeight;
      padding-bottom: 0px;
      .list-img {
        height: $halfCenterHeight;
        width: auto;
        transition: all 0.2s;
      }
    }
    .list-bottom {
      display: block;
    }
  }
  /* 缩小展示 */
  @keyframes miniAnimation {
    from {
      width: $itemWidth * 2;
    }
    to {
      width: $itemWidth;
    }
  }
  &.miniAnimation {
    animation: miniAnimation 0.5s;
  }
}
</style>
