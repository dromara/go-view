<template>
  <div class="go-edit">
    <n-layout>
      <n-layout-header class="go-edit-header go-px-5 go-flex-items-center" bordered>
        <div>
          <n-text class="go-edit-title go-mr-4">页面在线编辑器</n-text>
          <n-button v-if="showOpenFilePicker" class="go-mr-3" size="medium" @click="importJSON">
            <template #icon>
              <n-icon>
                <download-icon></download-icon>
              </n-icon>
            </template>
            导入
          </n-button>
        </div>
        <n-space>
          <n-tag :bordered="false" type="warning"> 「页面失焦保存」 </n-tag>
          <n-tag :bordered="false" type="warning"> 「ctrl + s 保存」 </n-tag>
        </n-space>
      </n-layout-header>
      <n-layout-content>
        <monaco-editor
          v-model:modelValue="content"
          language="json"
          :editorOptions="{
            lineNumbers: 'on',
            minimap: { enabled: true }
          }"
      />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MonacoEditor } from '@/components/Pages/MonacoEditor'
import { SavePageEnum } from '@/enums/editPageEnum'
import { getSessionStorageInfo } from '../preview/utils'
import type { ChartEditStorageType } from '../preview/index.d'
import { setSessionStorage, fetchRouteParamsLocation } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { icon } from '@/plugins'
import { useSync } from '@/views/chart/hooks/useSync.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { ProjectInfoEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
const chartEditStore = useChartEditStore()
const { dataSyncUpdate } = useSync()
const { ChevronBackOutlineIcon, DownloadIcon } = icon.ionicons5
const showOpenFilePicker: Function = (window as any).showOpenFilePicker
const content = ref('')
// 从sessionStorage 获取数据
async function getDataBySession() {
  const localStorageInfo: ChartEditStorageType = await getSessionStorageInfo() as unknown as ChartEditStorageType
  content.value = JSON.stringify(localStorageInfo, undefined, 2)
}
setTimeout(getDataBySession)

// 返回父窗口
function back() {
  window.opener.name = Date.now()
  window.open(window.opener.location.href, window.opener.name)
}

// 导入json文本
async function importJSON() {
  const files = await showOpenFilePicker()
  const file = await files[0].getFile()
  const fr = new FileReader()
  fr.readAsText(file)
  fr.onloadend = () => {
    content.value = (fr.result || '').toString()
  }
}

// 同步 [画布页失去焦点时同步数据到JSON页，JSON页Ctrl+S 时同步数据到画布页]
window.opener.addEventListener(SavePageEnum.CHART, (e: any) => {
  setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, [e.detail])
  content.value = JSON.stringify(e.detail, undefined, 2)
})

// 窗口失焦 + 保存 => 同步数据
document.addEventListener('keydown', function (e) {
  if (e.keyCode == 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
    e.preventDefault()
    updateSync()
  }
})
addEventListener('blur', updateSync)

// 同步更新
async function updateSync() {
  if (!window.opener) {
    return window['$message'].error('源窗口已关闭，视图同步失败')
  }
  try {
    const detail = JSON.parse(content.value)
    delete detail.id
    // 保持id不变
    // 带后端版本额外处理请求
    if (dataSyncUpdate) {
      chartEditStore.setProjectInfo(ProjectInfoEnum.PROJECT_ID, fetchRouteParamsLocation())
      await dataSyncUpdate(false) // JSON界面保存不上传缩略图
    }
    window.opener.dispatchEvent(new CustomEvent(SavePageEnum.JSON, { detail }))
  } catch (e) {
    window['$message'].error('内容格式有误')
    console.log(e)
  }
}
</script>

<style lang="scss" scoped>
.go-edit {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .go-edit-header {
    display: flex;
    align-items: center;
    height: 60px;
    justify-content: space-between;
    .go-edit-title {
      position: relative;
      bottom: 3px;
      font-size: 18px;
      font-weight: bold;
    }
  }
  @include deep() {
    .go-editor-area {
      height: calc(100vh - 60px) !important;
    }
  }
}
</style>
