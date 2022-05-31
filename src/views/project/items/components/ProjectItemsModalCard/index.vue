<template>
  <!-- mask-closable 暂时是失效的，不知道为啥 -->
  <n-modal
    class="go-modal-box"
    v-model:show="modalShow"
    @afterLeave="closeHandle"
  >
    <n-card hoverable size="small">
      <div class="list-content">
        <!-- 标题 -->
        <n-space class="list-content-top go-px-0" justify="center">
          <n-space>
            <n-text>
              {{ cardData?.title || '' }}
            </n-text>
          </n-space>
        </n-space>
        <!-- 顶部按钮 -->
        <n-space class="list-content-top">
          <mac-os-control-btn
            :narrow="true"
            :hidden="['close']"
            @remove="closeHandle"
         ></mac-os-control-btn>
        </n-space>
        <!-- 中间 -->
        <div class="list-content-img">
          <img
            :src="cardData?.image"
            :alt="cardData?.title"
          />
        </div>
      </div>
      <template #action>
        <n-space class="list-footer" justify="space-between">
          <n-text depth="3">
            {{ $t('project.last_edit') }}:
            <n-time :time="new Date()" format="yyyy-MM-dd hh:mm"></n-time>
          </n-text>
          <!-- 工具 -->
          <n-space>
            <n-text>
              <n-badge
                class="animation-twinkle"
                dot
                :color="cardData?.release ? '#34c749' : '#fcbc40'"
             ></n-badge>
              {{
                cardData?.release
                  ? $t('project.release')
                  : $t('project.unreleased')
              }}
            </n-text>

            <template v-for="item in fnBtnList" :key="item.key">
              <n-tooltip placement="bottom" trigger="hover">
                <template #trigger>
                  <n-button size="small" @click="handleSelect(item.key)">
                    <template #icon>
                      <component :is="item.icon"></component>
                    </template>
                  </n-button>
                </template>
                <component :is="item.label"></component>
              </n-tooltip>
            </template>
          </n-space>
          <!-- end -->
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { reactive, PropType } from 'vue'
import { renderIcon, renderLang } from '@/utils'
import { icon } from '@/plugins'
import { MacOsControlBtn } from '@/components/Tips/MacOsControlBtn'
import { Chartype } from '../../index.d'

const { HammerIcon } = icon.ionicons5

const emit = defineEmits(['close', 'edit'])

const props = defineProps({
  modalShow: Boolean,
  cardData: Object as PropType<Chartype>
})

const fnBtnList = reactive([
  {
    label: renderLang('global.r_edit'),
    key: 'edit',
    icon: renderIcon(HammerIcon)
  }
])

const handleSelect = (key: string) => {
  switch (key) {
    case 'edit':
      editHandle()
      break
  }
}

// 编辑处理
const editHandle = () => {
  emit('edit', props.cardData)
}

// 关闭对话框
const closeHandle = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
$padding: 30px;
$contentHeight: calc(80vh);
$imageHeight: calc(80vh - 110px);
$contentWidth: calc(82vw);

@include go('modal-box') {
  width: $contentWidth;
  height: $contentHeight;
  .list-content {
    margin-top: 20px;
    border-radius: $--border-radius-base;
    overflow: hidden;
    @include background-image('background-point');
    @extend .go-point-bg;
    &-top {
      position: absolute;
      top: 7px;
      left: 0px;
      padding-left: 10px;
      height: 22px;
      width: $contentWidth;
    }
    &-img {
      @extend .go-flex-center;
      padding: 6px 0;
      img {
        height: $imageHeight;
        min-height: 200px;
        max-width: 100%;
        @extend .go-border-radius;
      }
    }
  }
  .list-footer {
    line-height: 30px;
  }
}
</style>
