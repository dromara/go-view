<template>
  <div class="go-items-list">
    <!-- 加载 -->
    <div v-show="loading">
      <go-loading></go-loading>
    </div>
    <!-- 列表 -->
    <div v-show="!loading">
      <n-grid :x-gap="20" :y-gap="20" cols="2 s:2 m:3 l:4 xl:4 xxl:4" responsive="screen">
        <n-grid-item v-for="(item, index) in list" :key="item.id">
          <project-items-card
            :cardData="item"
            @preview="previewHandle"
            @resize="resizeHandle"
            @delete="deleteHandle(item)"
            @release="releaseHandle(item, index)"
            @edit="editHandle"
          ></project-items-card>
        </n-grid-item>
      </n-grid>
    </div>

    <!-- 分页 -->
    <div class="list-pagination">
      <n-pagination
        :page="paginat.page"
        :page-size="paginat.limit"
        :item-count="paginat.count"
        :page-sizes="[12, 24, 36, 48]"
        @update:page="changePage"
        @update:page-size="changeSize"
        show-size-picker
      />
    </div>
  </div>

  <!-- model -->
  <project-items-modal-card
    v-if="modalData"
    v-model:modalShow="modalShow"
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
const { modalData, modalShow, closeModal, previewHandle, resizeHandle, editHandle } = useModalDataInit()
const { loading, paginat, list, changeSize, changePage, releaseHandle, deleteHandle } = useDataListInit()
</script>

<style lang="scss" scoped>
$contentHeight: 250px;
@include go('items-list') {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100vh - #{$--header-height} - 40px - 2px);
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
