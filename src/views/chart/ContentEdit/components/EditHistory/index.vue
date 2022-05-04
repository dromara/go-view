<template>
  <div class="go-flex-items-center">
    <n-popover
      class="edit-history-popover"
      :show="showDropdownRef"
      :show-arrow="false"
      size="small"
      trigger="click"
      placement="top-start"
    >
      <template #trigger>
        <n-button
          class="mr-10"
          secondary
          size="small"
          :disabled="options.length === 0"
          @click="handleClick"
        >
          <span class="btn-text">历史记录</span>
        </n-button>
      </template>

      <div class="history-list-box">
        <n-scrollbar style="max-height: 500px">
          <div
            class="list-item go-flex-items-center go-ellipsis-1"
            v-for="item in options"
            :key="item.key"
            :title="item.label"
          >
            <n-icon
              class="item-icon"
              size="16"
              :depth="2"
              :component="item.icon"
            />
            <n-text depth="2">{{ item.label }}</n-text>
          </div>
        </n-scrollbar>
        <div class="popover-modal"></div>
      </div>
    </n-popover>

    <n-tooltip trigger="hover">
      <template #trigger>
        <n-icon size="21" :depth="3">
          <help-outline-icon></help-outline-icon>
        </n-icon>
      </template>
      <span>最多只保留{{ editHistoryMax }}条记录</span>
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { icon } from '@/plugins'
import { renderIcon } from '@/utils'
import { useChartHistoryStore } from '@/store/modules/chartHistoryStore/chartHistoryStore'
import { historyActionTypeName } from '@/store/modules/chartHistoryStore/chartHistoryDefine'
import { CreateComponentType } from '@/packages/index.d'
import { editHistoryMax } from '@/settings/designSetting'
import reverse from 'lodash/reverse'
import {
  HistoryItemType,
  HistoryTargetTypeEnum,
  HistoryActionTypeEnum,
} from '@/store/modules/chartHistoryStore/chartHistoryStore.d'

const {
  DesktopOutlineIcon,
  PencilIcon,
  TrashIcon,
  CopyIcon,
  LayersIcon,
  DuplicateIcon,
  HelpOutlineIcon,
} = icon.ionicons5
const { StackedMoveIcon } = icon.carbon
const showDropdownRef = ref(false)

const chartHistoryStoreStore = useChartHistoryStore()

// 设置类型对应图标
const iconHandle = (e: HistoryItemType) => {
  // 画布编辑
  if (e.targetType === HistoryTargetTypeEnum.CANVAS) {
    return DesktopOutlineIcon
  }
  switch (e.actionType) {
    case HistoryActionTypeEnum.UPDATE:
      return PencilIcon
    case HistoryActionTypeEnum.DELETE:
      return TrashIcon
    case HistoryActionTypeEnum.PASTE:
      return CopyIcon
    case HistoryActionTypeEnum.TOP:
      return LayersIcon
    case HistoryActionTypeEnum.BOTTOM:
      return LayersIcon
    case HistoryActionTypeEnum.UP:
      return LayersIcon
    case HistoryActionTypeEnum.DOWN:
      return LayersIcon
    case HistoryActionTypeEnum.MOVE:
      return StackedMoveIcon
    case HistoryActionTypeEnum.ADD:
      return DuplicateIcon
    default:
      return PencilIcon
  }
}

// 设置类型对应文本
const labelHandle = (e: HistoryItemType) => {
  // 画布编辑
  if (e.targetType === HistoryTargetTypeEnum.CANVAS) {
    return historyActionTypeName[HistoryTargetTypeEnum.CANVAS]
  }
  return `${historyActionTypeName[e.actionType]} - ${
    (e.historyData as CreateComponentType).chartConfig.title
  }`
}

const options = computed(() => {
  const backStack: HistoryItemType[] = chartHistoryStoreStore.getBackStack
  const options = backStack.map((e: HistoryItemType) => {
    return {
      label: labelHandle(e),
      key: e.id,
      icon: iconHandle(e),
    }
  })
  return reverse(options)
})

const handleClick = () => {
  showDropdownRef.value = !showDropdownRef.value
}
</script>

<style lang="scss" scoped>
.mr-10 {
  margin-right: 10px;
}
.edit-history-popover {
  .btn-text {
    font-size: 12px;
    margin-right: 3px;
  }
  .history-list-box {
    width: 100%;
    .list-item {
      z-index: 2;
      position: relative;
      cursor: default;
      padding: 2px;
      .item-icon {
        margin-right: 10px;
      }
    }
  }
}
</style>
