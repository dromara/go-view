import { ref, nextTick } from 'vue'
import { UploadCustomRequestOptions } from 'naive-ui'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { fetchChartComponent } from '@/packages/index'
import { CreateComponentType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { ChartEditStoreEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { useChartHistoryStore } from '@/store/modules/chartHistoryStore/chartHistoryStore'
import { readFile, goDialog } from '@/utils'
import { createComponent } from '@/packages'

// 更新函数
const updateComponent = async (fileData: any, isSplace = false) => {
  const chartEditStore = useChartEditStore()
  const chartHistoryStore = useChartHistoryStore()
  if (isSplace) {
    // 清除列表
    chartEditStore.componentList = []
    // 清除历史记录
    chartHistoryStore.clearBackStack()
    chartHistoryStore.clearForwardStack()
  }
  // 列表组件注册
  fileData.componentList.forEach(async (e: CreateComponentType) => {
    if (!window['$vue'].component(e.chartConfig.chartKey)) {
      window['$vue'].component(
        e.chartConfig.chartKey,
        fetchChartComponent(e.chartConfig)
      )
    }
  })
  // 数据赋值
  for (const key in fileData) {
    // 组件
    if (key === ChartEditStoreEnum.COMPONENT_LIST) {
      for (const comItem of fileData[key]) {
        // 补充 class 上的方法
        let newComponent: CreateComponentType = await createComponent(
          comItem.chartConfig
        )
        // 不保存到记录
        chartEditStore.addComponentList(
          Object.assign(newComponent, comItem),
          false,
          true
        )
      }
    } else {
      // 非组件(顺便排除脏数据)
      if(key !== 'editCanvasConfig' && key !== 'requestGlobalConfig') return
      Object.assign((chartEditStore as any)[key], fileData[key])
    }
  }
}

export const useFile = () => {
  const importUploadFileListRef = ref()

  // 上传-前置
  //@ts-ignore
  const importBeforeUpload = ({ file }) => {
    importUploadFileListRef.value = []
    const type = file.file.type
    if (type !== FileTypeEnum.JSON && type !== FileTypeEnum.TXT) {
      window['$message'].warning('仅支持上传 【JSON】 格式文件，请重新上传！')
      return false
    }
    return true
  }

  // 上传-导入
  const importCustomRequest = (options: UploadCustomRequestOptions) => {
    const { file } = options
    nextTick(() => {
      if (file.file) {
        readFile(file.file).then((fileData: any) => {
          goDialog({
            message: '请选择导入方式:',
            positiveText: '新增（可撤回）',
            negativeText: '覆盖（不可撤回）',
            negativeButtonProps: { type: 'info', ghost: false },
            // 新增
            onNegativeCallback: async () => {
              fileData = JSON.parse(fileData)
              await updateComponent(fileData, true)
              window['$message'].success('导入成功！')
            },
            // 覆盖
            onPositiveCallback: async () => {
              fileData = JSON.parse(fileData)
              await updateComponent(fileData)
              window['$message'].success('导入成功！')
            }
          })
        })
      } else {
        window['$message'].error('导入失败，请检查数据或联系管理员！')
      }
    })
  }

  return {
    importUploadFileListRef,
    importBeforeUpload,
    importCustomRequest
  }
}
