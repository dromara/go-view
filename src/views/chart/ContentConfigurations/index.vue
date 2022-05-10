<template>
  <n-layout has-sider sider-placement="right">
    <n-layout-content>
      <!-- 图表拖拽区域 -->
      <content-edit></content-edit>
    </n-layout-content>
    <n-layout-sider
      collapse-mode="transform"
      :collapsed-width="0"
      :width="350"
      :collapsed="collapsed"
      :native-scrollbar="false"
      show-trigger="bar"
      @collapse="collapsedHindle"
      @expand="expandHindle"
    >
      <content-box
        class="go-content-layers go-boderbox"
        :show-top="false"
        :depth="2"
      >
        <!-- 页面配置 -->
        <n-tabs
          v-show="!selectTarget"
          class="tabs-box"
          size="small"
          type="segment"
        >
          <n-tab-pane
            v-for="item in globalTabList"
            :key="item.key"
            :name="item.key"
            size="small"
            display-directive="show:lazy"
          >
            <template #tab>
              <n-space>
                <span>{{ item.title }}</span>
                <n-icon size="16" class="icon-position">
                  <component :is="item.icon"></component>
                </n-icon>
              </n-space>
            </template>
            <component :is="item.render"></component>
          </n-tab-pane>
        </n-tabs>

        <!-- 编辑 -->
        <n-tabs
          v-show="selectTarget"
          class="tabs-box"
          size="small"
          type="segment"
        >
          <n-tab-pane
            v-for="(item) in canvasTabList"
            :key="item.key"
            :name="item.key"
            size="small"
            display-directive="show:lazy"
          >
            <template #tab>
              <n-space>
                <span>{{ item.title }}</span>
                <n-icon size="16" class="icon-position">
                  <component :is="item.icon"></component>
                </n-icon>
              </n-space>
            </template>
            <component :is="item.render"></component>
          </n-tab-pane>
        </n-tabs>
      </content-box>
    </n-layout-sider>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, computed } from 'vue'
import { icon } from '@/plugins'
import { loadAsyncComponent } from '@/utils'
import { ContentBox } from '../ContentBox/index'
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore'
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'

const { getDetails } = toRefs(useChartLayoutStore())
const { setItem } = useChartLayoutStore()
const chartEditStore = useChartEditStore()

const {
  ConstructIcon,
  FlashIcon,
  DesktopOutlineIcon,
  LeafIcon
} = icon.ionicons5

const ContentEdit = loadAsyncComponent(() => import('../ContentEdit/index.vue'))
const CanvasPage = loadAsyncComponent(() =>
  import('./components/CanvasPage/index.vue')
)
const ChartSetting = loadAsyncComponent(() =>
  import('./components/ChartSetting/index.vue')
)
const ChartData = loadAsyncComponent(() =>
  import('./components/ChartData/index.vue')
)
const ChartAnimation = loadAsyncComponent(() =>
  import('./components/ChartAnimation/index.vue')
)

const collapsed = ref<boolean>(getDetails.value)

const collapsedHindle = () => {
  collapsed.value = true
  setItem(ChartLayoutStoreEnum.DETAILS, true)
}

const expandHindle = () => {
  collapsed.value = false
  setItem(ChartLayoutStoreEnum.DETAILS, false)
}

const selectTarget = computed(() => {
  const selectId = chartEditStore.getTargetChart.selectId
  if (!selectId) return undefined
  return chartEditStore.componentList[chartEditStore.fetchTargetIndex()]
})

watch(getDetails, newData => {
  if (newData) {
    collapsedHindle()
  } else {
    expandHindle()
  }
})

// 页面设置
const globalTabList = [
  {
    key: 'pageSetting',
    title: '页面配置',
    icon: DesktopOutlineIcon,
    render: CanvasPage
  }
]

const canvasTabList = [
  {
    key: 'ChartSetting',
    title: '定制',
    icon: ConstructIcon,
    render: ChartSetting
  },
  {
    key: 'ChartAnimation',
    title: '动画',
    icon: LeafIcon,
    render: ChartAnimation
  },
  {
    key: 'ChartData',
    title: '数据',
    icon: FlashIcon,
    render: ChartData
  }
]
</script>

<style lang="scss" scoped>
@include go(content-layers) {
  overflow: hidden;
  .tabs-box {
    padding: 10px;
    .icon-position {
      padding-top: 2px;
    }
  }
}
</style>
