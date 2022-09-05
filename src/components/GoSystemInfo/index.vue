<template>
  <n-modal v-model:show="modelShow" @afterLeave="closeHandle">
    <n-list bordered class="go-system-info">
      <template #header>
        <n-space justify="space-between">
          <n-h3 class="go-mb-0">关于我们</n-h3>
          <n-icon size="20" class="go-cursor-pointer" @click="closeHandle">
            <close-icon></close-icon>
          </n-icon>
        </n-space>
      </template>

      <n-list-item>
        <n-space :size="20">
          <n-text class="item-left">版权声明：</n-text>
          <n-text>
            GoView 版权属于
            <n-a href="https://gitee.com/MTrun/go-view" target="_blank">https://gitee.com/MTrun/go-view</n-a> 项目作者
          </n-text>
        </n-space>
      </n-list-item>

      <n-list-item>
        <n-divider style="margin-top: 0" />
        <n-space :size="20">
          <n-text class="item-left">协议备注：</n-text>
          <n-text>
            请遵守开源 MIT 协议，以上声明 <n-text type="error">不可删除</n-text>，否则视作侵权行为，后果自负！
          </n-text>
        </n-space>
      </n-list-item>

      <n-list-item>
        <n-divider style="margin-top: 0" />
        <n-space :size="20">
          <n-text class="item-left">商业授权：</n-text>
          <n-text>
            若不想保留版权声明，请通过仓库/交流群 联系项目作者，进行授权
          </n-text>
        </n-space>
      </n-list-item>
    </n-list>
  </n-modal>
</template>

<script lang="ts" setup>
import { icon } from '@/plugins'

const { HelpOutlineIcon, CloseIcon } = icon.ionicons5
const emit = defineEmits(['update:modelShow'])

defineProps({
  modelShow: Boolean
})

const closeHandle = () => {
  emit('update:modelShow', false)
}
</script>

<style lang="scss" scoped>
@include go('system-info') {
  @extend .go-background-filter;
  min-width: 100px;
  max-width: 60vw;
  padding-bottom: 20px;
  .item-left {
    width: 200px;
  }
  @include deep() {
    .n-list-item:not(:last-child) {
      border-bottom: 0;
    }
  }
}
</style>
