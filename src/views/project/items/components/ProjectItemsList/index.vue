<template>
  <div class="go-items-list">
    <n-grid
      :x-gap="20"
      :y-gap="20"
      cols="2 s:2 m:3 l:4 xl:4 xxl:4"
      responsive="screen"
    >
      <n-grid-item v-for="(item, index) in list" :key="item.id">
        <project-items-card
          :cardData="item"
          @resize="resizeHandle"
          @delete="deleteHandle($event, index)"
          @edit="editHandle"
        ></project-items-card>
      </n-grid-item>
    </n-grid>
    <div class="list-pagination">
      <n-pagination
        :item-count="10"
        :page-sizes="[10, 20, 30, 40]"
        show-size-picker
      />
    </div>
  </div>
  <project-items-modal-card
    v-if="modalData"
    :modalShow="modalShow"
    :cardData="modalData"
    @close="closeModal"
    @edit="editHandle"
  ></project-items-modal-card>
</template>

<script setup lang="ts">
import { ProjectItemsCard } from '../ProjectItemsCard/index'
import { ProjectItemsModalCard } from '../ProjectItemsModalCard/index'
import { icon } from '@/plugins'
import { useModalDataInit } from './hooks/useModal.hook'
import { useDataListInit } from './hooks/useData.hook'

const { CopyIcon, EllipsisHorizontalCircleSharpIcon } = icon.ionicons5
const { list, deleteHandle } = useDataListInit()
const { modalData, modalShow, closeModal, resizeHandle, editHandle } = useModalDataInit()
</script>

<style lang="scss" scoped>
$contentHeight: 250px;
@include go('items-list') {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100vh - #{$--header-height} * 2 - 2px);
  .list-content {
    position: relative;
    height: $contentHeight;
  }
  .list-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
