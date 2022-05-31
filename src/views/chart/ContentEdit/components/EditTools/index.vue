<template>
  <div
    class="go-chart-edit-tools"
    :class="[
      settingStore.getChartToolsStatus,
      isMini ? 'isMini' : 'unMini',
    ]"
    @click="isMini && (isMini = false)"
    @mouseenter="toolsMouseoverHandle"
    @mouseleave="toolsMouseoutHandle"
  >
    <!-- PawIcon -->
    <n-icon
      v-show="settingStore.getChartToolsStatus === ToolsStatusEnum.ASIDE"
      class="asideLogo"
      size="22"
    >
      <PawIcon></PawIcon>
    </n-icon>

    <n-tooltip
      v-for="(item, index) in btnList"
      :key="item.key"
      :disabled="!isAside || asideTootipDis"
      trigger="hover"
      placement="left"
    >
      <template #trigger>
        <div class="btn-item" :class="[btnList.length - 1 === index && 'go-111mt-0']">
          <n-button
            v-if="item.type === TypeEnum.BUTTON"
            :circle="isAside"
            secondary
            @click="item.handle"
          >
            <template #icon>
              <n-icon size="22" v-if="isAside">
                <component :is="item.icon"></component>
              </n-icon>
              <component v-else :is="item.icon"></component>
            </template>
            <n-text depth="3" v-show="!isAside">{{ item.name }}</n-text>
          </n-button>
          <!-- 下载 -->
          <n-upload
            v-else-if="item.type === TypeEnum.IMPORTUPLOAD"
            v-model:file-list="importUploadFileListRef"
            :show-file-list="false"
            :customRequest="importCustomRequest"
            @before-upload="importBeforeUpload"
          >
            <n-button :circle="isAside" secondary>
              <template #icon>
                <n-icon size="22" v-if="isAside">
                  <component :is="item.icon"></component>
                </n-icon>
                <component v-else :is="item.icon"></component>
              </template>
              <n-text depth="3" v-show="!isAside">{{ item.name }}</n-text>
            </n-button>
          </n-upload>
        </div>
      </template>
      <!-- 提示 -->
      <span>{{ item.name }}</span>
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSettingStore } from '@/store/modules/settingStore/settingStore'
import { ToolsStatusEnum } from '@/store/modules/settingStore/settingStore.d'
import { exportHandle } from './utils'
import { useFile } from './hooks/useFile.hooks'
import { BtnListType, TypeEnum } from './index.d'
import { icon } from '@/plugins'

const { DownloadIcon, ShareIcon, PawIcon } = icon.ionicons5
const settingStore = useSettingStore()
// 鼠标悬停定时器
let mouseTime: any = null
// 最小化
const isMini = ref<boolean>(true)
// 是否是侧边栏
const isAside = computed(() => settingStore.getChartToolsStatus === ToolsStatusEnum.ASIDE)
// 控制 tootip 提示时机
const asideTootipDis = ref(true)
// 文件上传
const { importUploadFileListRef, importCustomRequest, importBeforeUpload } = useFile()

const btnList: BtnListType[] = [{
  key: 'import',
  type: TypeEnum.IMPORTUPLOAD,
  name: '导入',
  icon: DownloadIcon,
}, {
  key: 'export',
  type: TypeEnum.BUTTON,
  name: '导出',
  icon: ShareIcon,
  handle: exportHandle
}]

const toolsMouseoverHandle = () => {
  mouseTime = setTimeout(() => {
    if (isMini.value) {
      isMini.value = false
      asideTootipDis.value = true
    }
  }, 200);
  setTimeout(() => {
    asideTootipDis.value = false
  }, 400)
}

const toolsMouseoutHandle = () => {
  clearTimeout(mouseTime)
  if (!isMini.value) {
    isMini.value = true
  }
}
</script>

<style lang="scss" scoped>
/* 底部区域的高度 */
$dockHeight: 30px;
$dockBottom: 60px;
$dockMiniWidth: 200px;
$dockMiniBottom: 53px;

$asideHeight: 90px;
$asideMiniHeight: 22px;
$asideBottom: 70px;

@include go("chart-edit-tools") {
  @extend .go-background-filter;
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 25px;
  border: 1px solid;
  mix-blend-mode: luminosity;
  @include fetch-border-color("hover-border-color-shallow");
  &.aside {
    flex-direction: column-reverse;
    height: auto;
    right: 20px;
    padding: 20px 8px;
    bottom: $asideBottom;
    overflow: hidden;
    transition: height ease 0.4s;
    .btn-item {
      margin-bottom: 10px;
      @include deep() {
        .n-button__icon {
          margin-right: 4px;
          margin-bottom: 14px;
        }
      }
    }
    &.unMini {
      animation: aside-in 0.4s ease forwards;
      @keyframes aside-in {
        0% {
          opacity: 0.5;
          height: $asideMiniHeight;
        }
        100% {
          height: $asideHeight;
          opacity: 1;
        }
      }
      .btn-item {
        position: relative;
        display: block;
      }
      .asideLogo {
        opacity: 0.4;
      }
    }
    &.isMini {
      cursor: pointer;
      padding: 13px 13px;
      background-color: var(--n-toggle-bar-color);
      animation: aside-mini-in 0.4s ease forwards;
      @keyframes aside-mini-in {
        0% {
          opacity: 0.5;
          height: $asideHeight;
        }
        100% {
          opacity: 1;
          height: $asideMiniHeight;
        }
      }
      .btn-item {
        position: relative;
        display: none;
      }
      .asideLogo {
        opacity: 1;
      }
    }
  }

  &.dock {
    width: auto;
    left: 50%;
    transform: translateX(-50%);
    .btn-item {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
    &.unMini {
      animation: dock-in 0.4s ease forwards;
      @keyframes dock-in {
        0% {
          opacity: 0;
          height: 0;
          padding: 5px;
          bottom: $dockMiniBottom;
          mix-blend-mode: screen;
        }
        100% {
          height: $dockHeight;
          padding: 8px 30px;
          bottom: $dockBottom;
          border-radius: 25px;
          mix-blend-mode: none;
        }
      }
    }
    /* 最小化 */
    &.isMini {
      height: 0;
      width: $dockMiniWidth;
      bottom: $dockMiniBottom;
      padding: 5px;
      border-radius: 8px;
      cursor: pointer;
      border: 0px;
      mix-blend-mode: screen;
      animation: dock-mini-in 1s ease forwards;
      @keyframes dock-mini-in {
        0% {
          opacity: 1;
          height: $dockHeight;
          padding: 8px 30px;
          bottom: $dockBottom;
          border-radius: 25px;
        }
        20% {
          height: 0;
          border-radius: 8px;
        }
        50% {
          opacity: 0;
          bottom: calc(#{$dockMiniBottom} - 10px);
        }
        100% {
          opacity: 1;
          height: 0;
          padding: 5px;
          bottom: $dockMiniBottom;
          mix-blend-mode: screen;
        }
      }
      .btn-item {
        position: relative;
        bottom: -50px;
        display: none;
      }
    }
    &::after {
      content: "";
      position: absolute;
      left: 0;
      width: 100%;
      height: 20px;
      bottom: -20px;
      cursor: pointer;
    }
  }
}
</style>
