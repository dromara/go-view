<template>
  <n-timeline class="go-chart-configurations-timeline">
    <n-timeline-item v-if="isCharts && dimensionsAndSource" type="info" :title="TimelineTitleEnum.MAPPING">
      <n-table striped>
        <thead>
          <tr>
            <th v-for="item in tableTitle" :key="item">{{ item }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dimensionsAndSource" :key="index">
            <td>{{ item.field }}</td>
            <td>{{ item.mapping }}</td>
            <td>
              <n-space v-if="item.result === 0">
                <n-badge dot type="success"></n-badge>
                <n-text>无</n-text>
              </n-space>
              <n-space v-else>
                <n-badge dot :type="item.result === 1 ? 'success' : 'error'"></n-badge>
                <n-text>匹配{{ item.result === 1 ? '成功' : '失败' }}</n-text>
              </n-space>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-timeline-item>
    <n-timeline-item type="success" :title="TimelineTitleEnum.CONTENT">
      <n-space vertical>
        <n-text depth="3">ECharts 图表需符合 ECharts-setdata 数据规范</n-text>
        <n-space class="source-btn-box">
          <n-upload
            v-model:file-list="uploadFileListRef"
            :show-file-list="false"
            :customRequest="customRequest"
            @before-upload="beforeUpload"
          >
            <n-space>
              <n-button v-if="!ajax" class="sourceBtn-item">
                <template #icon>
                  <n-icon>
                    <document-add-icon />
                  </n-icon>
                </template>
                导入（json / txt）
              </n-button>
            </n-space>
          </n-upload>
          <div>
            <n-button class="sourceBtn-item" @click="download">
              <template #icon>
                <n-icon>
                  <document-download-icon />
                </n-icon>
              </template>
              下载
            </n-button>
           <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon class="go-ml-1" size="21" :depth="3">
                  <help-outline-icon></help-outline-icon>
                </n-icon>
              </template>
              <n-text depth="3">点击【下载】查看完整数据</n-text>
            </n-tooltip>
          </div>
        </n-space>
        <n-card>
          <n-code :code="getSource" language="json"></n-code>
        </n-card>
      </n-space>
    </n-timeline-item>
  </n-timeline>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CreateComponentType, PackagesCategoryEnum } from '@/packages/index.d'
import { icon } from '@/plugins'
import { DataResultEnum, TimelineTitleEnum } from '../../index.d'
import { useFile } from '../../hooks/useFile.hooks'
import { useTargetData } from '../../../hooks/useTargetData.hook'
import isObject from 'lodash/isObject'
const { targetData } = useTargetData()

const props = defineProps({
  ajax: {
    type: Boolean,
    required: true
  }
})

// 表格标题
const tableTitle = ['字段', '映射', '状态']

const { HelpOutlineIcon } = icon.ionicons5
const { DocumentAddIcon, DocumentDownloadIcon } = icon.carbon

const source = ref()
const dimensions = ref()
const dimensionsAndSource = ref()

const { uploadFileListRef, customRequest, beforeUpload, download } = useFile(targetData)

// 是图表类型
const isCharts = computed(() => {
  return targetData.value.chartConfig.package === PackagesCategoryEnum.CHARTS
})

// 获取数据
const getSource = computed(() => {
  return JSON.stringify(source.value)
})

// 处理映射列表状态结果
const matchingHandle = (mapping: string) => {
  let res = DataResultEnum.SUCCESS
  for (let i = 0; i < source.value.length; i++) {
    if (source.value[i][mapping] === undefined) {
      res = DataResultEnum.FAILURE
      return res
    }
  }
  return DataResultEnum.SUCCESS
}

// 处理映射列表
const dimensionsAndSourceHandle = () => {
  try {
    // 去除首项数据轴标识
    return dimensions.value.map((dimensionsItem: string, index: number) => {
      return index === 0 ?
        {
          // 字段
          field: '通用标识',
          // 映射
          mapping: dimensionsItem,
          // 结果
          result: DataResultEnum.NULL
        } : {
          field: `数据项-${index}`,
          mapping: dimensionsItem,
          result: matchingHandle(dimensionsItem)
        }
    })
  } catch (error) {
    return []
  }
}

watch(() => targetData.value?.option?.dataset, (newData: {
  source: any,
  dimensions: any
} | null) => {
  if (newData && isObject(newData)) {
    // 只有 Echarts 数据才有对应的格式
    source.value = isCharts.value ? newData.source : newData
    if (isCharts.value) {
      dimensions.value = newData.dimensions
      dimensionsAndSource.value = dimensionsAndSourceHandle()
    }
  } else {
    dimensionsAndSource.value = null
    source.value = newData
  }
}, {
  immediate: true
})
</script>

<style lang="scss" scoped>
@include go("chart-configurations-timeline") {
  @include deep() {
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
  .source-btn-box {
    margin-top: 10px !important;
  }
}
</style>
