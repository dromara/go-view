<template>
  <div class="go-edit-align-line">
    <div
      class="line"
      v-for="item in line.lineArr"
      :key="item"
      :class="[
        item.includes('row') ? 'row' : 'col',
        line['select'].has(item) && 'visible'
      ]"
      :style="useComponentStyle(line['select'].get(item))"
  ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasTypeEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { useSettingStore } from '@/store/modules/settingStore/settingStore'
import { CreateComponentType } from '@/packages/index.d'
import throttle from 'lodash/throttle'
import cloneDeep  from 'lodash/cloneDeep'
// 全局颜色
const designStore = useDesignStore()
const themeColor = ref(designStore.getAppTheme)

const chartEditStore = useChartEditStore()
const settingStore = useSettingStore()

// * 线条集合
const line = reactive({
  // 行横向row（上中下），列竖线col（左中右）
  lineArr: ['rowt', 'rowc', 'rowb', 'coll', 'colc', 'colr'],
  // 展示线
  select: new Map(),
  // 已经吸附
  sorptioned: {
    x: false,
    y: false
  }
})

// * 位置计算
const useComponentStyle = (attr?: Partial<{ x: number; y: number }>) => {
  if (!attr) return {}
  const componentStyle = {
    left: `${attr.x ? attr.x : 0}px`,
    top: `${attr.y ? attr.y : 0}px`
  }
  return componentStyle
}

// * 吸附距离
const minDistance = computed(()=>{
  return settingStore.getChartAlignRange
})

// * 是否开始计算
const isComputedLine = computed(() => {
  // IS_DRAG 移动时为 true，Drag Hook里设置
  const isDrag = chartEditStore.getEditCanvas[EditCanvasTypeEnum.IS_DRAG]
  return isDrag
})

// * 吸附判定
const isSorption = (selectValue: number, componentValue: number) => {
  const isSorption = Math.abs(selectValue - componentValue) <= minDistance.value
  return isSorption
}

// * 当前目标
const selectId = computed(() => chartEditStore.getTargetChart.selectId)
const selectTarget = computed(
  () => chartEditStore.getComponentList[chartEditStore.fetchTargetIndex()]
)
const selectAttr = computed(() => selectTarget.value?.attr || {})

// * 画布坐标
const canvasPositionList = computed(() => {
  return {
    id: '0',
    attr: {
      w: cloneDeep(chartEditStore.getEditCanvasConfig.width),
      h: cloneDeep(chartEditStore.getEditCanvasConfig.height),
      x: 0,
      y: 0,
      zIndex: 0
    }
  }
})

// * 监听鼠标移动
watch(
  () => chartEditStore.getMousePosition,
  throttle(() => {
    if (!isComputedLine.value) return
    // 获取目标组件数据

    const selectW = selectAttr.value.w
    const selectH = selectAttr.value.h

    // 距离左侧
    const selectLeftX = selectAttr.value.x
    const selectHalfX = selectLeftX + selectW / 2
    const selectRightX = selectLeftX + selectW
    const seletX = [selectLeftX, selectHalfX, selectRightX]

    // 距离顶部
    const selectTopY = selectAttr.value.y
    const selectHalfY = selectTopY + selectH / 2
    const selectBottomY = selectTopY + selectH
    const seletY = [selectTopY, selectHalfY, selectBottomY]

    line.select.clear()
    line.sorptioned.y = false
    // 循环查询所有组件数据
    const componentList = chartEditStore.getComponentList.map((e:CreateComponentType) => {
      return {
        id: e.id,
        attr: e.attr
      }
    })
    componentList.push(canvasPositionList.value)
    // 传入画布数据
    line.lineArr.forEach(lineItem => {
      componentList.forEach((component: typeof canvasPositionList.value) => {
        // 排除自身
        if (selectId.value === component.id) return
        const componentW = component.attr.w
        const componentH = component.attr.h

        // 距离左侧
        const componentLeftX = component.attr.x
        const componentHalfX = componentLeftX + componentW / 2
        const componentRightX = componentLeftX + componentW
        const componentX = [componentLeftX, componentHalfX, componentRightX]

        // 距离顶部
        const componentTopY = component.attr.y
        const componentHalfY = componentTopY + componentH / 2
        const componentBottomY = componentTopY + componentH
        const componentY = [componentTopY, componentHalfY, componentBottomY]

        // 横线对比的是 Y
        if (lineItem.includes('rowt')) {
          // 顶部
          if (isSorption(selectTopY, componentTopY)) {
            line.select.set(lineItem, { y: componentTopY })
            selectTarget.value.setPosition(selectLeftX, componentTopY)
          }
          if (isSorption(selectTopY, componentHalfY)) {
            line.select.set(lineItem, { y: componentHalfY })
            selectTarget.value.setPosition(selectLeftX, componentHalfY)
          }
          if (isSorption(selectTopY, componentBottomY)) {
            line.select.set(lineItem, { y: componentBottomY })
            selectTarget.value.setPosition(selectLeftX, componentBottomY)
          }
        }
        if (lineItem.includes('rowc')) {
          // 顶部
          if (isSorption(selectHalfY, componentTopY)) {
            line.select.set(lineItem, { y: componentTopY })
            selectTarget.value.setPosition(
              selectLeftX,
              componentTopY - selectH / 2
            )
          }
          if (isSorption(selectHalfY, componentHalfY)) {
            line.select.set(lineItem, { y: componentHalfY })
            selectTarget.value.setPosition(
              selectLeftX,
              componentHalfY - selectH / 2
            )
          }
          if (isSorption(selectHalfY, componentBottomY)) {
            line.select.set(lineItem, { y: componentBottomY })
            selectTarget.value.setPosition(
              selectLeftX,
              componentBottomY - selectH / 2
            )
          }
        }
        if (lineItem.includes('rowb')) {
          // 顶部
          if (isSorption(selectBottomY, componentTopY)) {
            line.select.set(lineItem, { y: componentTopY })
            selectTarget.value.setPosition(selectLeftX, componentTopY - selectH)
          }
          if (isSorption(selectBottomY, componentHalfY)) {
            line.select.set(lineItem, { y: componentHalfY })
            selectTarget.value.setPosition(
              selectLeftX,
              componentHalfY - selectH
            )
          }
          if (isSorption(selectBottomY, componentBottomY)) {
            line.select.set(lineItem, { y: componentBottomY })
            selectTarget.value.setPosition(
              selectLeftX,
              componentBottomY - selectH
            )
          }
        }

        // 纵线对比的是 X
        if (lineItem.includes('coll')) {
          if (isSorption(selectLeftX, componentLeftX)) {
            line.select.set(lineItem, { x: componentLeftX })
            selectTarget.value.setPosition(componentLeftX, selectTopY)
          }
          if (isSorption(selectLeftX, componentHalfX)) {
            line.select.set(lineItem, { x: componentHalfX })
            selectTarget.value.setPosition(componentHalfX, selectTopY)
          }
          if (isSorption(selectLeftX, componentRightX)) {
            line.select.set(lineItem, { x: componentRightX })
            selectTarget.value.setPosition(componentRightX, selectTopY)
          }
        }
        if (lineItem.includes('colc')) {
          if (isSorption(selectHalfX, componentLeftX)) {
            line.select.set(lineItem, { x: componentLeftX })
            selectTarget.value.setPosition(
              componentLeftX - selectW / 2,
              selectTopY
            )
          }
          if (isSorption(selectHalfX, componentHalfX)) {
            line.select.set(lineItem, { x: componentHalfX })
            selectTarget.value.setPosition(
              componentHalfX - selectW / 2,
              selectTopY
            )
          }
          if (isSorption(selectHalfX, componentRightX)) {
            line.select.set(lineItem, { x: componentRightX })
            selectTarget.value.setPosition(
              componentRightX - selectW / 2,
              selectTopY
            )
          }
        }
        if (lineItem.includes('colr')) {
          if (isSorption(selectRightX, componentLeftX)) {
            line.select.set(lineItem, { x: componentLeftX })
            selectTarget.value.setPosition(componentLeftX - selectW, selectTopY)
          }
          if (isSorption(selectRightX, componentHalfX)) {
            line.select.set(lineItem, { x: componentHalfX })
            selectTarget.value.setPosition(componentHalfX - selectW, selectTopY)
          }
          if (isSorption(selectRightX, componentRightX)) {
            line.select.set(lineItem, { x: componentRightX })
            selectTarget.value.setPosition( componentRightX - selectW, selectTopY )
          }
        }

        /*
          * 我也不知道为什么这个不行，还没时间调
          if(lineItem.includes('row')) {
            seletY.forEach(sY => {
              componentY.forEach(cY => {
                if (isSorption(sY, cY)) {
                  line.select.set(lineItem, { y: cY })
                }
              })
            })
            return
          }
          if(lineItem.includes('col')) {
            seletX.forEach(sX => {
              componentX.forEach(cX => {
                if (isSorption(sX, cX)) {
                  line.select.set(lineItem, { x: sX })
                }
              })
            })
            return
          }
        */
      })
    })
  }, 200),
  {
    deep: true
  }
)

// * 取消对齐线
watch(
  () => isComputedLine.value,
  (val: boolean) => {
    if (!val) {
      line.select.clear()
      line.sorptioned.y = false
      chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, true)
    }
  }
)
</script>

<style lang="scss" scoped>
@include go(edit-align-line) {
  .line {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    border-width: 1px;
    border-style: solid;
    border-color: v-bind('themeColor');
    opacity: 0.7;
    &.visible {
      display: block;
    }
  }
  .row {
    width: 100%;
  }
  .col {
    height: 100%;
  }
}
</style>
