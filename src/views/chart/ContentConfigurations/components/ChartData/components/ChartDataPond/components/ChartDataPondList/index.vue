<template>
  <div class="go-chart-data-pond-list">
    <n-timeline style="width: 20px">
      <n-timeline-item type="info"> </n-timeline-item>
      <n-timeline-item type="success"></n-timeline-item>
    </n-timeline>
    <div class="pond-item-box">
      <!-- 新增 -->
      <n-button class="create-btn go-py-4" ghost @click="createPond">
        <span> 创建 </span>
        <template #icon>
          <n-icon>
            <DuplicateOutlineIcon></DuplicateOutlineIcon>
          </n-icon>
        </template>
      </n-button>
      <n-divider style="margin: 10px 0"></n-divider>
      <n-space v-if="!requestDataPond.length" justify="center">
        <n-text class="not-layer-text" :depth="3">
          暂无数据内容，
          <n-a @click="createPond">立即创建</n-a>
        </n-text>
      </n-space>
      <n-scrollbar style="max-height: 490px">
        <div
          v-for="item in requestDataPond"
          :key="item.dataPondId"
          :class="{ select: item.dataPondId === selectPondId }"
          class="pond-item"
          @click="clickHandle(item)"
        >
          <div class="item-content">
            <div class="item-content-body">
              <div>
                <n-tag class="go-mr-1" :type="item.dataPondId === selectPondId ? 'warning' : ''" :bordered="false">
                  名称
                </n-tag>
                <n-ellipsis style="max-width: 180px">
                  {{ item.dataPondName || '暂无' }}
                </n-ellipsis>
              </div>
              <div>
                <n-tag class="go-mr-1" :type="item.dataPondId === selectPondId ? 'warning' : ''" :bordered="false">
                  地址
                </n-tag>
                <n-ellipsis style="max-width: 180px">
                  {{ item.dataPondRequestConfig.requestUrl || '暂无' }}
                </n-ellipsis>
              </div>
            </div>
            <div class="item-content-icon go-transition-quick" @click="deletePond($event, item)">
              <n-icon>
                <trash-icon></trash-icon>
              </n-icon>
            </div>
          </div>
          <div :class="{ 'select-modal': item.dataPondId === selectPondId }"></div>
        </div>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'
import { useTargetData } from '@/views/chart/ContentConfigurations/components/hooks/useTargetData.hook'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { RequestDataPondItemType } from '@/store/modules/chartEditStore/chartEditStore.d'
import { icon } from '@/plugins'

const emit = defineEmits(['createPond', 'deletePond'])

const { DuplicateOutlineIcon, TrashIcon } = icon.ionicons5
const designStore = useDesignStore()
const { chartEditStore, targetData } = useTargetData()
const { requestDataPond } = toRefs(chartEditStore.getRequestGlobalConfig)

// 选中的全局数据
const selectPondId = computed(() => {
  return targetData.value.request.requestDataPondId
})

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})

// 创建数据池
const createPond = () => {
  emit('createPond', true)
}

// 删除数据池
const deletePond = (target: Event, targetData: RequestDataPondItemType) => {
  target.stopPropagation()
  target.preventDefault()
  emit('deletePond', targetData)
}

// 选中
const clickHandle = (item: RequestDataPondItemType) => {
  targetData.value.request.requestDataPondId = item.dataPondId
}
</script>

<style scoped lang="scss">
$height: 530px;
$listWidth: 280px;
$centerHeight: 60px;
$centerMiniHeight: 28px;
$textSize: 10px;

@include go('chart-data-pond-list') {
  padding-top: 10px;
  padding-bottom: 5px;
  margin-right: 5px;
  display: flex;
  @include deep() {
    .n-timeline > .n-timeline-item {
      &:first-child {
        height: $height;
      }
    }
  }
  .pond-item-box {
    width: $listWidth;
    position: relative;
    .create-btn {
      width: calc(#{$listWidth - 15px});
      margin-right: 15px;
    }
    .pond-item {
      position: relative;
      height: $centerHeight;
      padding: 5px;
      margin-bottom: 10px;
      margin-right: 15px;
      border-radius: 5px;
      cursor: pointer;
      border: 1px solid rgba(0, 0, 0, 0);
      @include fetch-bg-color('background-color3');
      @extend .go-transition-quick;
      &.hover,
      &:hover {
        @include fetch-bg-color('background-color4');
      }
      &:hover {
        @include deep() {
          .icon-item {
            opacity: 1;
          }
        }
        .item-content-icon {
          opacity: 1 !important;
        }
      }

      &.select {
        border: 1px solid v-bind('themeColor');
        background-color: rgba(0, 0, 0, 0);
        .item-content-icon {
          display: none;
        }
      }

      .select-modal,
      .item-content {
        position: absolute;
        top: 0;
        left: 0;
      }

      .item-content {
        z-index: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        .item-content-body {
          width: 230px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .item-content-icon {
          opacity: 0;
          height: $centerHeight;
          line-height: $centerHeight;
          padding-left: 5px;
        }
      }

      .select-modal {
        width: 100%;
        height: 100%;
        opacity: 0.3;
        background-color: v-bind('themeColor');
      }
    }
  }
}
</style>
