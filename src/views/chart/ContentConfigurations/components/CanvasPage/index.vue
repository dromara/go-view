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
          <img
            v-if="canvasConfig.backgroundImage"
            class="upload-show"
            :src="canvasConfig.backgroundImage"
            alt="背景"
          />
          <div class="upload-img" v-show="!canvasConfig.backgroundImage">
            <img src="@/assets/images/canvas/noImage.png" />
            <n-text class="upload-desc" depth="3">
              背景图需小于 {{ backgroundImageSize }}M ，格式为 png/jpg/gif
              的文件
            </n-text>
          </div>
        </n-upload-dragger>
      </n-upload>
    </n-card>
    <n-space vertical :size="12">
      <n-space>
        <n-text>背景色</n-text>
        <n-color-picker
          style="width: 326px;"
          :showPreview="true"
          :swatches="swatchesColors"
          v-model:value="canvasConfig.background"
        ></n-color-picker>
      </n-space>
      <n-space>
        <n-text>颜色应用</n-text>
        <n-switch
          size="small"
          v-model:value="canvasConfig.selectColor"
          :loading="switchSelectColorLoading"
          :round="false"
          :disabled="!canvasConfig.backgroundImage"
          :onUpdate="switchSelectColorHandle"
        ></n-switch>
      </n-space>
      <n-space>
        <n-text>背景控制</n-text>
        <n-button size="small" :disabled="!canvasConfig.backgroundImage" @click="clearImage">清除背景图</n-button>
        <n-button size="small" :disabled="!canvasConfig.background" @click="clearColor">清除颜色</n-button>
      </n-space>
      <n-space>
        <n-text>预览方式</n-text>
        <n-button-group>
          <n-button 
            ghost
            v-for="item in previewTypeList"
            :key="item.key"
            :type="canvasConfig.previewScaleType === item.key ? 'primary' : 'tertiary'"
            size="small"
            @click="selectPreviewType(item.key)">
            <n-tooltip :show-arrow="false" trigger="hover">
              <template #trigger>
                <n-icon size="18">
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
    <n-divider style="margin: 10px 0;"></n-divider>

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
import { ref, nextTick } from 'vue'
import { backgroundImageSize } from '@/settings/designSetting'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasConfigEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { useSystemStore } from '@/store/modules/systemStore/systemStore'
import { StylesSetting } from '@/components/Pages/ChartItemSetting'
import { UploadCustomRequestOptions } from 'naive-ui'
import { fileToUrl, loadAsyncComponent, fetchRouteParamsLocation } from '@/utils'
import { PreviewScaleEnum } from '@/enums/styleEnum'
import { ResultEnum } from '@/enums/httpEnum'
import { icon } from '@/plugins'
import { uploadFile} from '@/api/path'

const { ColorPaletteIcon } = icon.ionicons5
const { ScaleIcon, FitToScreenIcon, FitToHeightIcon, FitToWidthIcon } = icon.carbon

const chartEditStore = useChartEditStore()
const systemStore = useSystemStore()
const canvasConfig = chartEditStore.getEditCanvasConfig
const editCanvas = chartEditStore.getEditCanvas

const uploadFileListRef = ref()
const switchSelectColorLoading = ref(false)

const ChartThemeColor = loadAsyncComponent(() =>
  import('./components/ChartThemeColor/index.vue')
)

// 北京默认展示颜色列表
const swatchesColors = [
  '#232324',
  '#2a2a2b',
  '#313132',
  '#373739',
  '#757575',
  '#e0e0e0',
  '#eeeeee',
  '#fafafa'
]

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
  },
]

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
    window['$message'].warning(
      `图片超出 ${backgroundImageSize}M 限制，请重新上传！`
    )
    return false
  }
  if (type !== FileTypeEnum.PNG && type !== FileTypeEnum.JPEG && type !== FileTypeEnum.GIF) {
    window['$message'].warning('文件格式不符合，请重新上传！')
    return false
  }
  return true
}

// 清除背景
const clearImage = () => {
  chartEditStore.setEditCanvasConfig(
    EditCanvasConfigEnum.BACKGROUND_IMAGE,
    undefined
  )
  chartEditStore.setEditCanvasConfig(
    EditCanvasConfigEnum.SELECT_COLOR,
    true
  )
}

// 清除颜色
const clearColor = () => {
  chartEditStore.setEditCanvasConfig(
    EditCanvasConfigEnum.BACKGROUND,
    undefined
  )
  if (canvasConfig.backgroundImage) {
    chartEditStore.setEditCanvasConfig(
      EditCanvasConfigEnum.SELECT_COLOR,
      false
    )
  }
}

// 启用/关闭 颜色
const switchSelectColorHandle = () => {
  switchSelectColorLoading.value = true
  setTimeout(() => {
    switchSelectColorLoading.value = false
  }, 1000)
}

// 自定义上传操作
const customRequest = (options: UploadCustomRequestOptions) => {
  const { file } = options
  nextTick(async () => {
    if(!systemStore.getFetchInfo.OSSUrl) {
      window['$message'].error('添加图片失败，请刷新页面重试！')
      return
    }
    if (file.file) {
      // 修改名称
      const newNameFile = new File(
        [file.file],
        `${fetchRouteParamsLocation()}_index_background.png`,
        { type: file.file.type }
      )
      let uploadParams = new FormData()
      uploadParams.append('object', newNameFile)
      const uploadRes = await uploadFile(systemStore.getFetchInfo.OSSUrl ,uploadParams) as unknown as MyResponseType

      if(uploadRes.code === ResultEnum.SUCCESS) {
        chartEditStore.setEditCanvasConfig(
          EditCanvasConfigEnum.BACKGROUND_IMAGE,
          uploadRes.data.objectContent.httpRequest.uri
        )
        chartEditStore.setEditCanvasConfig(
          EditCanvasConfigEnum.SELECT_COLOR,
          false
        )
        return
      }
      window['$message'].error('添加图片失败，请稍后重试！')
    } else {
      window['$message'].error('添加图片失败，请稍后重试！')
    }
  })
}

// 选择预览方式
const selectPreviewType = (key: PreviewScaleEnum) => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.PREVIEW_SCALE_TYPE, key)
}
</script>

<style lang="scss" scoped>
$updloadWidth: 326px;
$updloadHeight: 193px;
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
        width: $updloadWidth;
      }
    }
    .upload-show {
      width: -webkit-fill-available;
      height: $updloadHeight;
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
  .tabs-box {
    margin-top: 20px;
  }
}
</style>
