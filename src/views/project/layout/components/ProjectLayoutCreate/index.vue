<template>
  <div @click="clickHandle">
    <n-tooltip v-if="collapsed" placement="right" trigger="hover">
      <template #trigger>
        <n-button ghost type="primary" size="small">
          <template #icon>
            <n-icon>
              <DuplicateOutlineIcon v-show="designStore.getDarkTheme"></DuplicateOutlineIcon>
              <DuplicateIcon v-show="!designStore.getDarkTheme"></DuplicateIcon>
            </n-icon>
          </template>
        </n-button>
      </template>
      <span>
        {{ $t('project.create_btn') }}
      </span>
    </n-tooltip>
    <n-button v-else ghost type="primary">
      <template #icon>
        <n-icon>
          <DuplicateOutlineIcon v-show="designStore.getDarkTheme"></DuplicateOutlineIcon>
          <DuplicateIcon v-show="!designStore.getDarkTheme"></DuplicateIcon>
        </n-icon>
      </template>
      <span>
        {{ $t('project.create_btn') }}
      </span>
    </n-button>
  </div>
  <CreateModal :show="modalShow" @close="closeHandle"></CreateModal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { CreateModal } from './components/CreateModal/index'
import { icon } from '@/plugins'

const { DuplicateIcon, DuplicateOutlineIcon } = icon.ionicons5
const designStore = useDesignStore()

const props = defineProps({
  collapsed: Boolean
})

const modalShow = ref<boolean>(false)

const clickHandle = () => {
  modalShow.value = true
}

const closeHandle = () => {
  modalShow.value = false
}
</script>
