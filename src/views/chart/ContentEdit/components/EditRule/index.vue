<template>
  <div class="go-sketch-rule">
    <sketch-rule
      v-if="sketchRuleReDraw"
      :thick="thick"
      :scale="scale"
      :width="canvasBox().width"
      :height="canvasBox().height"
      :startX="startX"
      :startY="startY"
      :lines="lines"
      :palette="paletteStyle"
    >
    </sketch-rule>
    <div ref="$app" class="edit-screens" @scroll="handleScroll">
      <div ref="$container" class="edit-screen-container" :style="{ width: width * 2 + 'px' }">
        <div
          ref="refSketchRuleBox"
          class="canvas"
          @mousedown="dragCanvas"
          :style="{ marginLeft: '-' + (canvasBox().width / 2 - 25) + 'px' }"
        >
          <div :style="{ pointerEvents: isPressSpace ? 'none' : 'auto' }">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
    <!-- 修复右下角白点用的 -->
    <div v-if="designStore.getDarkTheme" class="fix-edit-screens-block"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, toRefs, watch, onUnmounted, computed } from 'vue'
import { listen } from 'dom-helpers'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore'
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import throttle from 'lodash/throttle'

const chartEditStore = useChartEditStore()
const chartLayoutStore = useChartLayoutStore()
const designStore = useDesignStore()

const thick = 20
let prevMoveXValue = [0, 0]
let prevMoveYValue = [0, 0]

const $app = ref()
const sketchRuleReDraw = ref(true)
const refSketchRuleBox = ref()
const $container = ref()
const isPressSpace = ref(false)
const cursorStyle = ref('auto')
const { width, height } = toRefs(chartEditStore.getEditCanvasConfig)
const startX = ref(0)
const startY = ref(0)
const lines = reactive({ h: [], v: [] })

const scale = computed(() => {
  return chartEditStore.getEditCanvas.scale
})

// 滚动条拖动的高度
const containerWidth = computed(() => {
  return `${height.value * 2}px`
})

// 主题
const paletteStyle = computed(() => {
  const isDarkTheme = designStore.getDarkTheme
  return isDarkTheme
    ? {
        bgColor: '#18181c',
        longfgColor: '#4d4d4d',
        shortfgColor: '#4d4d4d',
        fontColor: '#4d4d4d',
        shadowColor: '#18181c',
        borderColor: '#18181c',
        cornerActiveColor: '#18181c'
      }
    : {}
})

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})

// 处理鼠标拖动
const handleWheel = (e: any) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    let resScale = scale.value
    // 放大(200%)
    if (e.wheelDelta >= 0 && scale.value < 2) {
      resScale = scale.value + 0.05
      chartEditStore.setScale(resScale)
      return
    }
    // 缩小(10%)
    if (e.wheelDelta < 0 && scale.value > 0.1) {
      resScale = scale.value - 0.05
      chartEditStore.setScale(resScale)
    }
  }
}

// 滚动条处理
const handleScroll = () => {
  if (!$app.value) return
  const screensRect = $app.value.getBoundingClientRect()
  const canvasRect = refSketchRuleBox.value.getBoundingClientRect()
  // 标尺开始的刻度
  startX.value = (screensRect.left + thick - canvasRect.left) / scale.value
  startY.value = (screensRect.top + thick - canvasRect.top) / scale.value
}

// 拖拽处理
const dragCanvas = (e: any) => {
  e.preventDefault()
  e.stopPropagation()

  if (e.which == 2) isPressSpace.value = true
  else if (!window.$KeyboardActive?.space) return
  // @ts-ignore
  document.activeElement?.blur()

  const startX = e.pageX
  const startY = e.pageY

  const listenMousemove = listen(window, 'mousemove', (e: any) => {
    const nx = e.pageX - startX
    const ny = e.pageY - startY

    const [prevMoveX1, prevMoveX2] = prevMoveXValue
    const [prevMoveY1, prevMoveY2] = prevMoveYValue

    prevMoveXValue = [prevMoveX2, nx]
    prevMoveYValue = [prevMoveY2, ny]

    $app.value.scrollLeft -=
      prevMoveX2 > prevMoveX1 ? Math.abs(prevMoveX2 - prevMoveX1) : -Math.abs(prevMoveX2 - prevMoveX1)
    $app.value.scrollTop -=
      prevMoveY2 > prevMoveY1 ? Math.abs(prevMoveY2 - prevMoveY1) : -Math.abs(prevMoveY2 - prevMoveY1)
  })

  const listenMouseup = listen(window, 'mouseup', () => {
    listenMousemove()
    listenMouseup()
    prevMoveXValue = [0, 0]
    prevMoveYValue = [0, 0]
    isPressSpace.value = false
  })
}

// 计算画布大小
const canvasBox = () => {
  const layoutDom = document.getElementById('go-chart-edit-layout')
  if (layoutDom) {
    return {
      height: layoutDom.clientHeight - 25,
      width: layoutDom.clientWidth
    }
  }
  return {
    width: width.value,
    height: height.value
  }
}

// 重绘标尺
const reDraw = () => {
  sketchRuleReDraw.value = false
  setTimeout(() => {
    sketchRuleReDraw.value = true
  }, 10)
}

// 滚动居中
const canvasPosCenter = () => {
  const { width: containerWidth, height: containerHeight } = $container.value.getBoundingClientRect()
  const { width, height } = canvasBox()

  $app.value.scrollLeft = containerWidth / 2 - width / 2
  $app.value.scrollTop = containerHeight / 2 - height / 2
}

// 处理主题变化
watch(
  () => designStore.getDarkTheme,
  () => {
    reDraw()
  }
)

// // 处理标尺重制大小
watch(
  () => scale.value,
  (newValue, oldValue) => {
    if (oldValue !== newValue && chartLayoutStore.getRePositionCanvas) {
      chartLayoutStore.setItemUnHandle(ChartLayoutStoreEnum.RE_POSITION_CANVAS, false)
      handleScroll()
      setTimeout(() => {
        canvasPosCenter()
        reDraw()
      }, 400)
    } else {
      throttle(reDraw, 20)
    }
  }
)

// 处理鼠标样式
watch(
  () => isPressSpace.value,
  newValue => {
    cursorStyle.value = newValue ? 'grab' : 'auto'
  }
)

onMounted(() => {
  if ($app.value) {
    $app.value.addEventListener('wheel', handleWheel, { passive: false })
    canvasPosCenter()
  }
})

onUnmounted(() => {
  if ($app.value) {
    $app.value.removeEventListener('wheel', handleWheel)
  }
})

window.onKeySpacePressHold = (isHold: boolean) => {
  isPressSpace.value = isHold
}
</script>

<style>
/* 使用 SCSS 会报错，直接使用最基础的 CSS 进行修改，
此库有计划 Vue3 版本，但是开发的时候还没发布 */
#mb-ruler {
  top: 0;
  left: 0;
}

/* 横线 */
#mb-ruler .v-container .lines .line {
  /* 最大缩放 200% */
  width: 200vw !important;
  border-top: 1px dashed v-bind('themeColor') !important;
}

#mb-ruler .v-container .indicator {
  border-bottom: 1px dashed v-bind('themeColor') !important;
}

/* 竖线 */
#mb-ruler .h-container .lines .line {
  /* 最大缩放 200% */
  height: 200vh !important;
  border-left: 1px dashed v-bind('themeColor') !important;
}

#mb-ruler .h-container .indicator {
  border-left: 1px dashed v-bind('themeColor') !important;
}

/* 坐标数值背景颜色 */
#mb-ruler .indicator .value {
  background-color: rgba(0, 0, 0, 0);
}

/* 删除按钮 */
#mb-ruler .line .del {
  padding: 0;
  color: v-bind('themeColor');
  font-size: 26px;
  font-weight: bolder;
}

#mb-ruler .corner {
  border-width: 0 !important;
}
</style>

<style lang="scss" scoped>
@include go('sketch-rule') {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;

  .edit-screens {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: auto;
    user-select: none;
    padding-bottom: 0px;

    /* firefox */
    scrollbar-color: rgba(144, 146, 152, 0.3) transparent;
    scrollbar-width: thin;

    /* chrome */
    &::-webkit-scrollbar,
    &::-webkit-scrollbar-track-piece {
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      width: 7px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: rgba(144, 146, 152, 0.3);
    }
  }

  .fix-edit-screens-block {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background-color: $--color-dark-bg-1;
  }

  .edit-screen-container {
    position: absolute;
    height: v-bind('containerWidth');
    top: 0;
    left: 0;
  }

  .canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 50% 0;
    transform: translateY(-50%);

    &:hover {
      cursor: v-bind('cursorStyle');
    }

    &:active {
      cursor: crosshair;
    }
  }
}
</style>
