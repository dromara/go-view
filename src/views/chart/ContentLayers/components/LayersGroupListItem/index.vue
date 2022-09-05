<template>
  <div class="go-content-layers-group-list-item">
    <div
      class="root-item-content"
      :class="{ hover: hover, select: select }"
      @click="clickHandle($event)"
      @mousedown="groupMousedownHandle($event)"
      @mouseenter="mouseenterHandle(componentGroupData)"
      @mouseleave="mouseleaveHandle(componentGroupData)"
      @contextmenu="handleContextMenu($event, componentGroupData, optionsHandle)"
    >
      <div class="go-flex-items-center item-content">
        <n-icon size="20" class="go-ml-1">
          <template v-if="expend">
            <folder-open-icon></folder-open-icon>
          </template>
          <template v-else>
            <folder-icon></folder-icon>
          </template>
        </n-icon>
        <n-ellipsis>
          <n-text class="go-ml-2 list-text" :depth="2">
            {{ componentGroupData.chartConfig.title }}
          </n-text>
        </n-ellipsis>
      </div>
      <div :class="{ 'select-modal': select }"></div>
    </div>
    <n-collapse-transition :show="expend">
      <LayersListItem
        v-for="element in componentGroupData.groupList"
        :key="element.id"
        :componentData="element"
        @mousedown="mousedownHandle($event, element, componentGroupData.id)"
        @mouseenter="mouseenterHandle(element)"
        @mouseleave="mouseleaveHandle(element)"
        @contextmenu="handleContextMenu($event, componentGroupData, optionsHandle)"
      ></LayersListItem>
    </n-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
import { MouseEventButton, WinKeyboard, MacKeyboard } from '@/enums/editPageEnum'
import { MenuEnum } from '@/enums/editPageEnum'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useContextMenu, divider } from '@/views/chart/hooks/useContextMenu.hook'
import { MenuOptionsItemType } from '@/views/chart/hooks/useContextMenu.hook.d'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { LayersListItem } from '../LayersListItem'
import throttle from 'lodash/throttle'
import { icon } from '@/plugins'

const props = defineProps({
  componentGroupData: {
    type: Object as PropType<CreateComponentGroupType>,
    required: true
  }
})

// 右键
const pickOptionsList = [MenuEnum.UN_GROUP]

// 全局颜色
const designStore = useDesignStore()
const { FolderIcon, FolderOpenIcon } = icon.ionicons5

const chartEditStore = useChartEditStore()
const { handleContextMenu, onClickOutSide } = useContextMenu()

const expend = ref(false)

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})

// 右键
const optionsHandle = (
  targetList: MenuOptionsItemType[],
  allList: MenuOptionsItemType[],
  targetInstance: CreateComponentType
) => {
  const filter = (menulist: MenuEnum[]) => {
    const list: MenuOptionsItemType[] = []
    allList.forEach(item => {
      if (menulist.includes(item.key as MenuEnum)) {
        list.push(item)
      }
    })
    return list
  }

  // 多选处理
  if (chartEditStore.getTargetChart.selectId.length > 1) {
    return filter([MenuEnum.GROUP])
  } else {
    return [...filter([MenuEnum.UN_GROUP]), divider(), ...targetList]
  }
}

// 点击
const clickHandle = (e: MouseEvent) => {
  // 按下左键 + CTRL
  if (
    window.$KeyboardActive?.has(WinKeyboard.CTRL_SOURCE_KEY) ||
    window.$KeyboardActive?.has(MacKeyboard.CTRL_SOURCE_KEY)
  )
    return
  // 判断左右键
  expend.value = !expend.value
  mousedownHandle(e, props.componentGroupData)
}

// 计算当前选中目标
const select = computed(() => {
  const id = props.componentGroupData.id
  return chartEditStore.getTargetChart.selectId.find((e: string) => e === id)
})

// 悬浮
const hover = computed(() => {
  return props.componentGroupData.id === chartEditStore.getTargetChart.hoverId
})

// 组点击事件
const groupMousedownHandle = (e: MouseEvent) => {
  onClickOutSide()
  // 若此时按下了 CTRL, 表示多选
  const id = props.componentGroupData.id
  if (
    e.buttons === MouseEventButton.LEFT &&
    (window.$KeyboardActive?.has(WinKeyboard.CTRL_SOURCE_KEY) ||
      window.$KeyboardActive?.has(MacKeyboard.CTRL_SOURCE_KEY))
  ) {
    // 若已选中，则去除
    if (chartEditStore.targetChart.selectId.includes(id)) {
      const exList = chartEditStore.targetChart.selectId.filter(e => e !== id)
      chartEditStore.setTargetSelectChart(exList)
    } else {
      chartEditStore.setTargetSelectChart(id, true)
    }
    return
  }
  chartEditStore.setTargetSelectChart(id)
}

// 公共点击事件
const mousedownHandle = (e: MouseEvent, componentInstance: CreateComponentType | CreateComponentGroupType, id?: string) => {
  e.preventDefault()
  e.stopPropagation()

  onClickOutSide()
  chartEditStore.setTargetSelectChart(id || componentInstance.id)
}

// 公共进入事件
const mouseenterHandle = (componentInstance: CreateComponentType | CreateComponentGroupType) => {
  chartEditStore.setTargetHoverChart(componentInstance.id)
}

// 公共移出事件
const mouseleaveHandle = (componentInstance: CreateComponentType | CreateComponentGroupType) => {
  chartEditStore.setTargetHoverChart(undefined)
}
</script>

<style lang="scss" scoped>
$centerHeight: 52px;
$textSize: 10px;

@include go(content-layers-group-list-item) {
  position: relative;
  width: 90%;
  margin: 10px 5%;
  margin-bottom: 5px;
  @extend .go-transition-quick;

  .root-item-content {
    height: $centerHeight;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0);
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
        border: 1px solid v-bind('themeColor') !important;
      }
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
    height: calc(#{$centerHeight} - 10px);
  }
  .select-modal {
    width: 100%;
    height: calc(#{$centerHeight} + 2px);
    opacity: 0.3;
    background-color: v-bind('themeColor');
  }
  .list-text {
    padding-left: 6px;
    font-size: $textSize;
  }
}
</style>
