<template>
  <!-- 侧边栏和数据分发处理 -->
  <div class="go-chart-common">
    <n-menu
      v-show="hidePackageOneCategory"
      class="chart-menu-width"
      v-model:value="selectValue"
      :options="packages.menuOptions"
      :icon-size="16"
      :indent="18"
      @update:value="clickItemHandle"
    ></n-menu>
    <div class="chart-content-list">
      <n-scrollbar>
        <charts-item-box :menuOptions="packages.selectOptions"></charts-item-box>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive } from 'vue'
import { ConfigType } from '@/packages/index.d'
import { useSettingStore } from '@/store/modules/settingStore/settingStore'
import { loadAsyncComponent } from '@/utils'

const ChartsItemBox = loadAsyncComponent(() => import('../ChartsItemBox/index.vue'))

const props = defineProps({
  selectOptions: {
    type: Object,
    default: () => {}
  }
})

// 隐藏设置
const settingStore = useSettingStore()

const hidePackageOneCategory = computed(() => {
  if (packages.categorysNum > 2) return true
  return !settingStore.getHidePackageOneCategory
})

let packages = reactive<{
  [T: string]: any
}>({
  // 侧边栏
  menuOptions: [],
  // 当前选择
  selectOptions: {},
  // 分类归档
  categorys: {
    all: []
  },
  categoryNames: {
    all: '所有'
  },
  // 分类归档数量
  categorysNum: 0,
  // 存储不同类别组件进来的选中值
  saveSelectOptions: {}
})

const selectValue = ref<string>()

// 设置初始列表
const setSelectOptions = (categorys: any) => {
  for (const val in categorys) {
    packages.selectOptions = categorys[val]
    break
  }
}

watch(
  // @ts-ignore
  () => props.selectOptions,
  (newData: { list: ConfigType[] }) => {
    packages.categorysNum = 0
    if (!newData) return
    newData.list.forEach((e: ConfigType) => {
      const value: ConfigType[] = (packages.categorys as any)[e.category]
      // @ts-ignore
      packages.categorys[e.category] = value && value.length ? [...value, e] : [e]
      packages.categoryNames[e.category] = e.categoryName
      packages.categorys['all'].push(e)
    })
    for (const val in packages.categorys) {
      packages.categorysNum += 1
      packages.menuOptions.push({
        key: val,
        label: packages.categoryNames[val]
      })
    }
    setSelectOptions(packages.categorys)
    // 默认选中处理
    selectValue.value = packages.menuOptions[0]['key']
  },
  {
    immediate: true
  }
)

// 处理点击事件
const clickItemHandle = (key: string) => {
  packages.selectOptions = packages.categorys[key]
}
</script>

<style lang="scss" scoped>
/* 此高度与 ContentBox 组件关联*/
$topHeight: 40px;
$menuWidth: 65px;
@include go('chart-common') {
  display: flex;
  height: calc(100vh - #{$--header-height} - #{$topHeight});
  .chart-menu-width {
    width: $menuWidth;
    flex-shrink: 0;
    @include fetch-bg-color('background-color2-shallow');
  }
  .chart-content-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @include deep() {
    .n-menu-item {
      height: 30px;
      &.n-menu-item--selected {
        &::before {
          background-color: rgba(0, 0, 0, 0);
        }
      }
      .n-menu-item-content {
        text-align: center;
        padding: 0px 14px !important;
        font-size: 12px !important;
      }
    }
  }
}
</style>
