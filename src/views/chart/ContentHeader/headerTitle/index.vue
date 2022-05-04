<template>
  <n-space>
    <n-icon size="20" :depth="3">
      <fish-icon></fish-icon>
    </n-icon>
    <n-text @click="handleFocus">
      工作空间 -
      <n-button v-show="!focus" secondary round size="tiny">{{ comTitle }}</n-button>
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
      @blur="handleBlur"
   ></n-input>
  </n-space>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { fetchRouteParams } from '@/utils'
import { icon } from '@/plugins'
const { FishIcon } = icon.ionicons5

const focus = ref<boolean>(false)
const inputInstRef = ref(null)

// 根据路由 id 参数获取项目信息
const fetchProhectInfoById = () => {
  const routeParamsRes = fetchRouteParams()
  if (!routeParamsRes) return
  const { id } = routeParamsRes
  if (id.length) {
    return id[0]
  }
  return ''

}

const title = ref<string>(fetchProhectInfoById() || '')


const comTitle = computed(() => {
  title.value = title.value.replace(/\s/g, "");
  return title.value.length ? title.value : '新项目'
})

const handleFocus = () => {
  focus.value = true
  nextTick(() => {
    ; (<any>inputInstRef).value.focus()
  })
}

const handleBlur = () => {
  focus.value = false
}
</script>
