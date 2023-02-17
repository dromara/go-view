<template>
  <div class="go-canvas-setting">
    <n-form inline :label-width="45" size="small" label-placement="left">
      <n-form-item label="宽度">
        <!-- 尺寸选择 -->
        <n-input-number
          size="small"
          v-model:value="canvasConfig.width"
          :disabled="editCanvas.lockScale"
          :validator="validator"
          @update:value="changeSizeHandle"
        ></n-input-number>
      </n-form-item>
      <n-form-item label="高度">
        <n-input-number
          size="small"
          v-model:value="canvasConfig.height"
          :disabled="editCanvas.lockScale"
          :validator="validator"
          @update:value="changeSizeHandle"
        ></n-input-number>
      </n-form-item>
    </n-form>

    <n-card class="upload-box">
      <n-upload
        v-model:file-list="uploadFileListRef"
        :show-file-list="false"
        :customRequest="customRequest"
        :onBeforeUpload="beforeUploadHandle"
      >
        <n-upload-dragger>
          <img v-if="canvasConfig.backgroundImage" class="upload-show" :src="canvasConfig.backgroundImage" alt="背景" />
          <div class="upload-img" v-show="!canvasConfig.backgroundImage">
            <img src="@/assets/images/canvas/noImage.png" />
            <n-text class="upload-desc" depth="3">
              背景图需小于 {{ backgroundImageSize }}M ，格式为 png/jpg/gif 的文件
            </n-text>
          </div>
        </n-upload-dragger>
      </n-upload>
    </n-card>
    <n-space vertical :size="12">
      <n-space>
        <n-text>背景颜色</n-text>
        <div class="picker-height">
          <n-color-picker
            v-if="!switchSelectColorLoading"
            size="small"
            style="width: 250px"
            v-model:value="canvasConfig.background"
            :showPreview="true"
            :swatches="swatchesColors"
          ></n-color-picker>
        </div>
      </n-space>
      <n-space>
        <n-text>应用类型</n-text>
        <n-select
          size="small"
          style="width: 250px"
          v-model:value="selectColorValue"
          :disabled="!canvasConfig.backgroundImage"
          :options="selectColorOptions"
          @update:value="selectColorValueHandle"
        />
      </n-space>
      <n-space>
        <n-text>背景控制</n-text>
        <n-button class="clear-btn" size="small" :disabled="!canvasConfig.backgroundImage" @click="clearImage">
          清除背景
        </n-button>
        <n-button class="clear-btn" size="small" :disabled="!canvasConfig.background" @click="clearColor">
          清除颜色
        </n-button>
      </n-space>
      <n-space>
        <n-text>适配方式</n-text>
        <n-button-group>
          <n-button
            v-for="item in previewTypeList"
            :key="item.key"
            :type="canvasConfig.previewScaleType === item.key ? 'primary' : 'tertiary'"
            ghost
            size="small"
            @click="selectPreviewType(item.key)"
          >
            <n-tooltip :show-arrow="false" trigger="hover">
              <template #trigger>
                <n-icon class="select-preview-icon" size="18">
                  <component :is="item.icon"></component>
                </n-icon>
              </template>
              {{ item.desc }}
            </n-tooltip>
          </n-button>
        </n-button-group>
      </n-space>
    </n-space>

    <!-- 滤镜 -->
    <styles-setting :isCanvas="true" :chartStyles="canvasConfig"></styles-setting>
    <n-divider style="margin: 10px 0"></n-divider>

    <!-- 主题选择和全局配置 -->
    <n-tabs class="tabs-box" size="small" type="segment">
      <n-tab-pane
        v-for="item in globalTabList"
        :key="item.key"
        :name="item.key"
        size="small"
        display-directive="show:lazy"
      >
        <template #tab>
          <n-space>
            <span>{{ item.title }}</span>
            <n-icon size="16" class="icon-position">
              <component :is="item.icon"></component>
            </n-icon>
          </n-space>
        </template>
        <component :is="item.render"></component>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { backgroundImageSize } from '@/settings/designSetting'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasConfigEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { StylesSetting } from '@/components/Pages/ChartItemSetting'
import { UploadCustomRequestOptions } from 'naive-ui'
import { fileToUrl, loadAsyncComponent } from '@/utils'
import { PreviewScaleEnum } from '@/enums/styleEnum'
import { icon } from '@/plugins'

const { ColorPaletteIcon } = icon.ionicons5
const { ScaleIcon, FitToScreenIcon, FitToHeightIcon, FitToWidthIcon } = icon.carbon

const chartEditStore = useChartEditStore()
const canvasConfig = chartEditStore.getEditCanvasConfig
const editCanvas = chartEditStore.getEditCanvas

const uploadFileListRef = ref()
const switchSelectColorLoading = ref(false)
const selectColorValue = ref(0)

const ChartThemeColor = loadAsyncComponent(() => import('./components/ChartThemeColor/index.vue'))

// 默认应用类型
const selectColorOptions = [
  {
    label: '应用颜色',
    value: 0
  },
  {
    label: '应用背景',
    value: 1
  }
]

// 默认展示颜色列表
const swatchesColors = ['#232324', '#2a2a2b', '#313132', '#373739', '#757575', '#e0e0e0', '#eeeeee', '#fafafa']

const globalTabList = [
  {
    key: 'ChartTheme',
    title: '主题颜色',
    icon: ColorPaletteIcon,
    render: ChartThemeColor
  }
]

const previewTypeList = [
  {
    key: PreviewScaleEnum.FIT,
    title: '自适应',
    icon: ScaleIcon,
    desc: '自适应比例展示，页面会有留白'
  },
  {
    key: PreviewScaleEnum.SCROLL_Y,
    title: 'Y轴滚动',
    icon: FitToWidthIcon,
    desc: 'X轴铺满，Y轴自适应滚动'
  },
  {
    key: PreviewScaleEnum.SCROLL_X,
    title: 'X轴滚动',
    icon: FitToHeightIcon,
    desc: 'Y轴铺满，X轴自适应滚动'
  },
  {
    key: PreviewScaleEnum.FULL,
    title: '铺满',
    icon: FitToScreenIcon,
    desc: '强行拉伸画面，填充所有视图'
  }
]

watch(
  () => canvasConfig.selectColor,
  newValue => {
    selectColorValue.value = newValue ? 0 : 1
  },
  {
    immediate: true
  }
)

// 画布尺寸规则
const validator = (x: number) => x > 50

// 修改尺寸
const changeSizeHandle = () => {
  chartEditStore.computedScale()
}

// 上传图片前置处理
//@ts-ignore
const beforeUploadHandle = async ({ file }) => {
  uploadFileListRef.value = []
  const type = file.file.type
  const size = file.file.size

  if (size > 1024 * 1024 * backgroundImageSize) {
    window['$message'].warning(`图片超出 ${backgroundImageSize}M 限制，请重新上传！`)
    return false
  }
  if (type !== FileTypeEnum.PNG && type !== FileTypeEnum.JPEG && type !== FileTypeEnum.GIF) {
    window['$message'].warning('文件格式不符合，请重新上传！')
    return false
  }
  return true
}

// 应用颜色
const selectColorValueHandle = (value: number) => {
  canvasConfig.selectColor = value == 0
}

// 清除背景
const clearImage = () => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND_IMAGE, undefined)
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, true)
}

// 启用/关闭 颜色（强制更新）
const switchSelectColorHandle = () => {
  switchSelectColorLoading.value = true
  setTimeout(() => {
    switchSelectColorLoading.value = false
  })
}

// 清除颜色
const clearColor = () => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND, undefined)
  if (canvasConfig.backgroundImage) {
    chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, false)
  }
  switchSelectColorHandle()
}

// 自定义上传操作
const customRequest = (options: UploadCustomRequestOptions) => {
  const { file } = options
  nextTick(() => {
    if (file.file) {
      const ImageUrl = fileToUrl(file.file)
      chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND_IMAGE, ImageUrl)
      chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, false)
    } else {
      window['$message'].error('添加图片失败，请稍后重试！')
    }
  })
}

// 选择适配方式
const selectPreviewType = (key: PreviewScaleEnum) => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.PREVIEW_SCALE_TYPE, key)
}
</script>

<style lang="scss" scoped>
$uploadWidth: 326px;
$uploadHeight: 193px;
@include go(canvas-setting) {
  padding-top: 20px;
  .upload-box {
    cursor: pointer;
    margin-bottom: 20px;
    @include deep() {
      .n-card__content {
        padding: 0;
        overflow: hidden;
      }
      .n-upload-dragger {
        padding: 5px;
        width: $uploadWidth;
      }
    }
    .upload-show {
      width: -webkit-fill-available;
      height: $uploadHeight;
      border-radius: 5px;
    }
    .upload-img {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        height: 150px;
      }
      .upload-desc {
        padding: 10px 0;
      }
    }
  }
  .icon-position {
    padding-top: 2px;
  }
  .picker-height {
    min-height: 35px;
  }
  .clear-btn {
    padding-left: 2.25em;
    padding-right: 2.25em;
  }
  .select-preview-icon {
    padding-right: .68em;
    padding-left: .68em;
  }
  .tabs-box {
    margin-top: 20px;
  }
}
</style>
