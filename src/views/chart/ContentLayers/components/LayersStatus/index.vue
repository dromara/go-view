<template>
  <div class="icon-item-box" v-show="!isGroup">
    <n-icon
      class="go-ml-1 icon-item"
      :class="{ active: status.lock }"
      size="15"
      :component="status.lock ? LockClosedOutlineIcon : LockOpenOutlineIcon"
      @click="lockHandle"
    />
    <n-icon
      class="go-ml-1 icon-item"
      :class="{ active: status.hide }"
      size="15"
      :component="status.hide ? EyeOffOutlineIcon : EyeOutlineIcon"
      @click="showHandle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { StatusType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { icon } from '@/plugins'

const props = defineProps({
  isGroup: {
    type: Boolean,
    default: false
  },
  hover: {
    type: Boolean,
    default: false
  },
  status: {
    type: Object as PropType<StatusType>,
    default: () => ({
      lock: false,
      hide: false
    })
  }
})

const { LockClosedOutlineIcon, LockOpenOutlineIcon, EyeOutlineIcon, EyeOffOutlineIcon } = icon.ionicons5
const chartEditStore = useChartEditStore()
const designStore = useDesignStore()

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})

// 隐藏 / 展示
const showHandle = (e: MouseEvent) => {
  e.stopPropagation()
  props.status.hide ? chartEditStore.setShow() : chartEditStore.setHide()
}

// 锁定 / 解锁
const lockHandle = (e: MouseEvent) => {
  e.stopPropagation()
  props.status.lock ? chartEditStore.setUnLock() : chartEditStore.setLock()
}
</script>

<style lang="scss" scoped>
$activeColor: v-bind('themeColor');

.icon-item-box {
  white-space: nowrap;

  .icon-item {
    opacity: 0;
    padding-top: 5px;
    @extend.go-transition;
    &.active,
    &:hover {
      color: $activeColor;
    }
    &.active {
      opacity: 1 !important;
    }
  }
}
</style>
