<template>
  <n-modal class="go-chart-data-request" v-model:show="modelShowRef" :mask-closable="false" :closeOnEsc="false">
    <n-card :bordered="false" role="dialog" size="small" aria-modal="true" style="width: 1000px; height: 800px">
      <template #header></template>
      <template #header-extra> </template>
      <n-scrollbar style="max-height: 718px">
        <div class="go-pr-3">
          <n-space vertical>
            <request-global-config></request-global-config>
            <request-target-config
              :target-data-request="targetDataRequest?.dataPondRequestConfig"
            ></request-target-config>
          </n-space>
        </div>
      </n-scrollbar>
      <!-- 底部 -->
      <template #action>
        <n-space justify="space-between">
          <n-space v-if="targetDataRequest">
            <n-tag  :bordered="false" type="primary">名称：</n-tag>
            <n-input
              v-model:value="targetDataRequest.dataPondName"
              ref="inputInstRef"
              type="text"
              size="small"
              :autofocus="true"
              :clearable="true"
              :minlength="1"
              :maxlength="16"
              placeholder="请输入名称"
            ></n-input>
          </n-space>
          <span v-else></span>
          <n-space>
            <n-button @click="closeHandle">取消</n-button>
            <n-button type="primary" @click="closeAndSendHandle">保存</n-button>
          </n-space>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { RequestContentTypeEnum } from '@/enums/httpEnum'
import { useTargetData } from '../../../hooks/useTargetData.hook'
import { RequestGlobalConfig } from './components/RequestGlobalConfig'
import { RequestTargetConfig } from './components/RequestTargetConfig'
import { RequestDataPondItemType } from '@/store/modules/chartEditStore/chartEditStore.d'
import { useSync } from '@/views/chart/hooks/useSync.hook'
import { goDialog } from '@/utils'

const props = defineProps({
  modelShow: Boolean,
  targetDataRequest: Object as PropType<RequestDataPondItemType>
})
const emit = defineEmits(['update:modelShow', 'editSaveHandle'])

const { dataSyncUpdate } = useSync()
const pondName = ref()
const inputInstRef = ref()
const modelShowRef = ref(false)

watch(() => props.modelShow, (newValue) => {
  modelShowRef.value = newValue
})


const closeHandle = () => {
  emit('update:modelShow', false)
}

const closeAndSendHandle = () => {
  if (!props.targetDataRequest?.dataPondName) {
    window.$message.warning('请在左下角输入名称！')
    inputInstRef.value?.focus()
    return
  }
  goDialog({
    message: '保存内容将同步修改所有使用此接口的组件, 是否继续?',
    isMaskClosable: true,
    transformOrigin: 'center',
    onPositiveCallback: () => {
      emit('update:modelShow', false)
      emit('editSaveHandle', props.targetDataRequest)
      dataSyncUpdate()
    }
  })
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
