<template>
  <n-modal class="go-chart-data-request" v-model:show="modelShowRef" :mask-closable="false" :closeOnEsc="false">
    <n-card :bordered="false" role="dialog" size="small" aria-modal="true" style="width: 1000px; height: 800px">
      <template #header></template>
      <template #header-extra> </template>
      <n-scrollbar style="max-height: 718px">
        <div class="go-pr-3">
          <n-space vertical>
            <request-global-config></request-global-config>
            <request-target-config :target-data-request="targetData?.request"></request-target-config>
          </n-space>
        </div>
      </n-scrollbar>
      <!-- 底部 -->
      <template #action>
        <n-space justify="space-between">
          <div>
            <n-text>「 {{ chartConfig.categoryName }} 」</n-text>
            <n-text>—— </n-text>
            <n-tag type="primary" :bordered="false" style="border-radius: 5px">
              {{ requestContentTypeObj[requestContentType] }}
            </n-tag>
          </div>
          <n-button type="primary" @click="closeAndSendHandle"> {{ saveBtnText || '保存 & 发送请求' }}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script script lang="ts" setup>
import { ref, toRefs, PropType, watch } from 'vue'
import { RequestContentTypeEnum } from '@/enums/httpEnum'
import { useTargetData } from '../../../hooks/useTargetData.hook'
import { RequestGlobalConfig } from './components/RequestGlobalConfig'
import { RequestTargetConfig } from './components/RequestTargetConfig'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'

const props = defineProps({
  modelShow: Boolean,
  targetData: Object as PropType<CreateComponentType>,
  saveBtnText: String || null
})
const emit = defineEmits(['update:modelShow', 'sendHandle'])

// 解构基础配置
const { chartConfig } = toRefs(props.targetData as CreateComponentType)
const { requestContentType } = toRefs((props.targetData as CreateComponentType).request)
const modelShowRef = ref(false)
const requestContentTypeObj = {
  [RequestContentTypeEnum.DEFAULT]: '普通请求',
  [RequestContentTypeEnum.SQL]: 'SQL 请求'
}

watch(
  () => props.modelShow,
  newValue => {
    modelShowRef.value = newValue
  },
  {
    immediate: true
  }
)

const closeHandle = () => {
  emit('update:modelShow', false)
}

const closeAndSendHandle = () => {
  emit('update:modelShow', false)
  emit('sendHandle')
}
</script>

<style lang="scss" scoped>
@include go('chart-data-request') {
  &.n-card.n-modal,
  .n-card {
    @extend .go-background-filter;
  }
  .n-card-shallow {
    background-color: rgba(0, 0, 0, 0) !important;
  }
  @include deep() {
    & > .n-card__content {
      padding-right: 0;
    }
    .n-card__content {
      padding-bottom: 5px;
    }
  }
}
</style>
