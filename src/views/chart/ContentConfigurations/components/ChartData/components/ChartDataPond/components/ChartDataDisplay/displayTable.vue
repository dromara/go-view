<template>
  <n-table
    :bordered="false"
    :single-line="false"
    size="small"
    style="border-bottom-right-radius: 7px; border-bottom-left-radius: 7px"
  >
    <thead>
      <tr>
        <th>key</th>
        <th>value</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in tableArray.content" :key="index">
        <td>
          {{ item.key || '暂无'}}
        </td>
        <td>
          {{ item.value  || '暂无'}}
        </td>
      </tr>
    </tbody>
  </n-table>
</template>

<script setup lang="ts">
import { PropType, reactive, ref, toRefs, watch } from 'vue'
import { RequestParamsObjType } from '@/enums/httpEnum'
import noData from '@/assets/images/canvas/noData.png'

const props = defineProps({
  target: Object as PropType<RequestParamsObjType>
})

// 默认表格
const defaultItem = {
  key: '',
  value: ''
}
const tableArray = reactive<{
  content: typeof defaultItem[]
}>({ content: [] })

// 监听选项
watch(
  () => props.target as RequestParamsObjType,
  (target: RequestParamsObjType) => {
    tableArray.content = []
    for (const k in target) {
      tableArray.content.push({
        key: k,
        value: target[k]
      })
    }
    // 默认值
    if (!tableArray.content.length) tableArray.content = [JSON.parse(JSON.stringify(defaultItem))]
  },
  {
    immediate: true,
    deep: true
  }
)
</script>