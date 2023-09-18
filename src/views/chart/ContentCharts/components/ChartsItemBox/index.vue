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
        :key="item.title"
        draggable
        @dragstart="!item.disabled && dragStartHandle($event, item)"
        @dragend="!item.disabled && dragendHandle"
        @dblclick="dblclickHandle(item)"
        @click="clickHandle(item)"
      >
        <div class="list-header">
          <mac-os-control-btn class="list-header-control-btn" :mini="true" :disabled="true"></mac-os-control-btn>
          <n-text class="list-header-text" depth="3">
            <n-ellipsis>{{ item.title }}</n-ellipsis>
          </n-text>
        </div>
        <div class="list-center go-flex-center go-transition" draggable="true">
          <Icon v-if="item.icon" class="list-img" :icon="item.icon" color="#999" width="48" />
          <chart-glob-image v-else class="list-img" :chartConfig="item" />
        </div>
        <div class="list-bottom">
          <n-text class="list-bottom-text" depth="3">
            <n-ellipsis style="max-width: 90%">{{ item.title }}</n-ellipsis>
          </n-text>
        </div>
        <!-- 遮罩 -->
        <div v-if="item.disabled" class="list-model"></div>
        <!-- 工具栏 -->
        <div v-if="isShowTools(item)" class="list-tools go-transition" @click="deleteHandle(item, index)">
          <n-button text type="default" color="#ffffff">
            <template #icon>
              <n-icon>
                <TrashIcon />
              </n-icon>
            </template>
            <span>删除</span>
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, watch, ref, Ref, computed, nextTick } from 'vue'
import { MacOsControlBtn } from '@/components/Tips/MacOsControlBtn/index'
import { ChartGlobImage } from '@/components/Pages/ChartGlobImage'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasTypeEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { ChartModeEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore'
import { usePackagesStore } from '@/store/modules/packagesStore/packagesStore'
import { componentInstall, loadingStart, loadingFinish, loadingError, JSONStringify, goDialog } from '@/utils'
import { DragKeyEnum } from '@/enums/editPageEnum'
import { createComponent } from '@/packages'
import { ConfigType, CreateComponentType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum } from '@/packages/components/Photos/index.d'
import { fetchConfigComponent, fetchChartComponent } from '@/packages/index'
import { Icon } from '@iconify/vue'
import { icon } from '@/plugins'

import omit from 'lodash/omit'

const chartEditStore = useChartEditStore()
const { TrashIcon } = icon.ionicons5

const emit = defineEmits(['deletePhoto'])
const props = defineProps({
  menuOptions: {
    type: Array as PropType<ConfigType[]>,
    default: () => []
  }
})

const chartLayoutStore = useChartLayoutStore()
const contentChartsItemBoxRef = ref()

// 判断工具栏展示
const isShowTools = (item: ConfigType) => {
  return !item.disabled && item.package === PackagesCategoryEnum.PHOTOS && item.category === ChatCategoryEnum.PRIVATE
}

// 组件展示状态
const chartMode: Ref<ChartModeEnum> = computed(() => {
  return chartLayoutStore.getChartType
})

// 拖拽处理
const dragStartHandle = (e: DragEvent, item: ConfigType) => {
  if (item.disabled) return
  // 动态注册图表组件
  componentInstall(item.chartKey, fetchChartComponent(item))
  componentInstall(item.conKey, fetchConfigComponent(item))
  // 将配置项绑定到拖拽属性上
  e!.dataTransfer!.setData(DragKeyEnum.DRAG_KEY, JSONStringify(omit(item, ['image'])))
  // 修改状态
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, true)
}

// 拖拽结束
const dragendHandle = () => {
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, false)
}

// 双击添加
const dblclickHandle = async (item: ConfigType) => {
  if (item.disabled) return
  try {
    loadingStart()
    // 动态注册图表组件
    componentInstall(item.chartKey, fetchChartComponent(item))
    componentInstall(item.conKey, fetchConfigComponent(item))
    // 创建新图表组件
    let newComponent: CreateComponentType = await createComponent(item)
    if (item.redirectComponent) {
      item.dataset && (newComponent.option.dataset = item.dataset)
      newComponent.chartConfig.title = item.title
      newComponent.chartConfig.chartFrame = item.chartFrame
    }
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

// 单击事件
const clickHandle = (item: ConfigType) => {
  item?.configEvents?.addHandle(item)
}

const deleteHandle = (item: ConfigType, index: number) => {
  goDialog({
    message: '是否删除此图片？',
    transformOrigin: 'center',
    onPositiveCallback: () => {
      const packagesStore = usePackagesStore()
      emit('deletePhoto', item, index)
      packagesStore.deletePhotos(item, index)
    }
  })
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
    position: relative;
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
        transform: scale(1.08);
      }
      .list-tools {
        opacity: 1;
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
        user-select: none;
      }
    }
    .list-center {
      padding: 6px 0;
      height: $centerHeight;
      overflow: hidden;
      .list-img {
        height: 100px;
        max-width: 140px;
        border-radius: 6px;
        object-fit: contain;
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
    .list-model {
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
    }
    .list-tools {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 0;
      left: 0;
      margin: 0 4px 2px;
      height: 26px;
      width: calc(100% - 8px);
      opacity: 0;
      border-radius: 6px;
      backdrop-filter: blur(20px);
      background-color: rgba(255, 255, 255, 0.15);
      &:hover {
        background-color: rgba(232, 128, 128, 0.7);
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
      .list-img {
        max-width: 76px;
      }
    }
    .list-center {
      height: $halfCenterHeight;
      padding-bottom: 0px;
      .list-img {
        height: $halfCenterHeight;
        width: auto;
        transition: all 0.2s;
        object-fit: contain;
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
