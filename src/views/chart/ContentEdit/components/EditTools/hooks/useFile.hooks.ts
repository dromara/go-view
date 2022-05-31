import { ref, nextTick } from 'vue'
import { UploadCustomRequestOptions } from 'naive-ui'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { readFile, goDialog } from '@/utils'
import { useSync } from '@/views/chart/hooks/useSync.hook'

export const useFile = () => {
  const importUploadFileListRef = ref()
  const { updateComponent } = useSync()
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
