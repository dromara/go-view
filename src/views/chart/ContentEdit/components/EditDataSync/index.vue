<template>
  <div class="go-edit-data-sync go-flex-items-center">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-text class="status-desc go-ml-2" :type="descType" depth="3">
          {{ statusDesc }}
        </n-text>
      </template>
      <span>{{saveInterval}}s 更新一次</span>
    </n-tooltip>
    <n-spin
      v-show="statusDesc === statusDescObj[1]['text']"
      class="go-ml-2"
      size="small"
    >
      <template #icon>
        <n-icon size="13">
          <reload-icon />
        </n-icon>
      </template>
    </n-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, watch } from 'vue'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { SyncEnum } from '@/enums/editPageEnum'
import { icon } from '@/plugins'
import { saveInterval } from '@/settings/designSetting'

const { ReloadIcon } = icon.ionicons5

const chartEditStore = useChartEditStore()
const designStore = useDesignStore()

const { saveStatus } = toRefs(chartEditStore.getEditCanvas)
const themeColor = ref(designStore.getAppTheme)

const statusDesc = ref('')
const descType = ref('')
let setTimeoutIns: NodeJS.Timeout = setTimeout(() => {})

const statusDescObj = {
  [SyncEnum.PENDING]: {
    text: '等待自动同步',
    type: '',
  },
  [SyncEnum.START]: {
    text: '正在同步中',
    type: 'success',
  },
  [SyncEnum.SUCCESS]: {
    text: '同步成功！',
    type: 'success',
  },
  [SyncEnum.FAILURE]: {
    text: '同步失败!',
    type: 'error',
  },
}

watch(
  () => saveStatus.value,
  newData => {
    clearTimeout(setTimeoutIns)
    statusDesc.value = statusDescObj[newData]['text']
    descType.value = statusDescObj[newData]['type']
    // 3秒重置展示
    setTimeoutIns = setTimeout(() => {
      statusDesc.value = statusDescObj[SyncEnum.PENDING]['text']
      descType.value = statusDescObj[SyncEnum.PENDING]['type']
    }, 3000)
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss" scoped>
@include go('edit-data-sync') {
  @include deep() {
    .n-spin {
      width: 13px;
      height: 13px;
    }
  }
  .status-desc {
    cursor: default;
    color: v-bind('themeColor');
    font-size: 12px;
    opacity: 0.8;
  }
}
</style>
