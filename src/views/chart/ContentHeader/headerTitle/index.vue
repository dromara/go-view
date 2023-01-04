<template>
  <n-space>
    <n-icon size="20" :depth="3">
      <fish-icon></fish-icon>
    </n-icon>
    <n-text @click="handleFocus">
      工作空间 -
      <n-button v-show="!focus" secondary round size="tiny">
        <span class="title">{{ comTitle }}</span>
      </n-button>
    </n-text>

    <n-input
      v-show="focus"
      ref="inputInstRef"
      size="small"
      type="text"
      maxlength="16"
      show-count
      round
      placeholder="请输入项目名称"
      v-model:value.trim="title"
      @keyup.enter="handleBlur"
      @blur="handleBlur"
    ></n-input>
  </n-space>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watchEffect } from 'vue'
import { ResultEnum } from '@/enums/httpEnum'
import { fetchRouteParamsLocation, httpErrorHandle } from '@/utils'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { ProjectInfoEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { updateProjectApi } from '@/api/path'
import { useSync } from '../../hooks/useSync.hook'
import { icon } from '@/plugins'

const chartEditStore = useChartEditStore()
const { dataSyncUpdate } = useSync()
const { FishIcon } = icon.ionicons5

const focus = ref<boolean>(false)
const inputInstRef = ref(null)

const title = ref<string>(fetchRouteParamsLocation())

watchEffect(() => {
  title.value = chartEditStore.getProjectInfo.projectName || ''
})

const comTitle = computed(() => {
  title.value = title.value && title.value.replace(/\s/g, '')
  return title.value.length ? title.value : fetchRouteParamsLocation()
})

const handleFocus = () => {
  focus.value = true
  nextTick(() => {
    inputInstRef.value && (inputInstRef.value as any).focus()
  })
}

const handleBlur = async () => {
  focus.value = false
  chartEditStore.setProjectInfo(ProjectInfoEnum.PROJECT_NAME, title.value || '')
  const res = (await updateProjectApi({
    id: fetchRouteParamsLocation(),
    projectName: title.value
  }))
  if (res && res.code === ResultEnum.SUCCESS) {
    dataSyncUpdate()
  } else {
    httpErrorHandle()
  }
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 15px;
}
</style>
