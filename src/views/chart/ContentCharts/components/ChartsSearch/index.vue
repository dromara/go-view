<template>
  <div class="go-chart-search">
    <n-popover
      class="chart-search-popover"
      :show-arrow="false"
      :show="showPopover"
      :to="false"
      trigger="hover"
      placement="bottom-start"
    >
      <template #trigger>
        <n-input-group>
          <n-input
            v-model:value.trim="search"
            size="small"
            :loading="loading"
            placeholder="请输入组件名称"
            @update:value="searchHandle"
          >
            <template #suffix>
              <n-icon v-show="!loading" :component="SearchIcon" />
            </template>
          </n-input>
        </n-input-group>
      </template>

      <div class="search-list-box">
        <n-scrollbar style="max-height: 500px">
          <n-empty
            v-show="!searchRes.length"
            size="small"
            description="没有找到组件~"
          ></n-empty>
          <div
            class="list-item go-flex-items-center go-ellipsis-1"
            v-for="item in searchRes"
            :key="item.key"
            :title="item.title"
            @click="selectChartHandle(item)"
          >
            <img class="list-item-img" v-lazy="item.image" alt="展示图" />
            <n-text depth="2">{{ item.title }}</n-text>
          </div>
        </n-scrollbar>
        <div class="popover-modal"></div>
      </div>
    </n-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { icon } from '@/plugins'
import { themeColor, MenuOptionsType } from '../../hooks/useAside.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { ConfigType, CreateComponentType } from '@/packages/index.d'
import { createComponent } from '@/packages'
import { isString, addEventListener, removeEventListener } from '@/utils'
import { fetchConfigComponent, fetchChartComponent } from '@/packages/index'
import {
  componentInstall,
  loadingStart,
  loadingFinish,
  loadingError,
} from '@/utils'

const props = defineProps({
  menuOptions: {
    type: Array,
    default: () => [],
  },
})

const { SearchIcon } = icon.ionicons5
const chartEditStore = useChartEditStore()
const showPopover = ref<boolean>(false)
const loading = ref<boolean | undefined>(undefined)
const search = ref<string | null>(null)
const searchRes = ref<ConfigType[]>([])

// 组件数组提取
const listFormatHandle = (options: any[]) => {
  const arr = []
  for (const item of options) {
    arr.push(...item.list)
  }
  return arr
}

// 组件列表
const List = listFormatHandle(props.menuOptions as unknown as ConfigType[])

// 关闭处理
const closeHandle = () => {
  loading.value = undefined
  showPopover.value = false
  search.value = null
  searchRes.value = []
}

// 搜索处理
const searchHandle = (key: string | null) => {
  if (!isString(key) || !key.length) {
    closeHandle()
    return
  }
  loading.value = true
  showPopover.value = true
  searchRes.value = List.filter(
    (e: ConfigType) => !key || e.title.toLowerCase().includes(key.toLowerCase())
  )
  setTimeout(() => {
    loading.value = undefined
  }, 500)
}

// 关闭处理
const listenerCloseHandle = (e: Event) => {
  if (!showPopover.value) return
  if (!e.target) return
  if (!(e.target as any).closest('.go-chart-search')) {
    closeHandle()
  }
}

// 选择处理
const selectChartHandle = async (item: ConfigType) => {
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
    // 清空搜索
    closeHandle()
    loadingFinish()
  } catch (error) {
    loadingError()
    window['$message'].warning(`图表正在研发中, 敬请期待...`)
  }
}

addEventListener(document, 'click', (e: Event) => {
  listenerCloseHandle(e)
})

onUnmounted(() => {
  removeEventListener(document, 'click', listenerCloseHandle)
})
</script>

<style lang="scss" scoped>
$width: 178px;
@include go('chart-search') {
  width: $width;
  margin-right: -12px;
  .chart-search-popover {
    .search-list-box {
      width: calc(#{$width} - 30px);
      .list-item {
        z-index: 2;
        position: relative;
        cursor: pointer;
        padding: 2px;
        margin-bottom: 5px;
        &-img {
          height: 30px;
          margin-right: 5px;
          border-radius: 5px;
        }
        &:hover {
          &::after {
            z-index: -1;
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0.1;
            left: 0;
            top: 0;
            border-radius: 5px;
            background-color: v-bind('themeColor');
          }
        }
      }
    }
  }
}
</style>