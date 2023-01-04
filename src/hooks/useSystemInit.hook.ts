import { useSystemStore } from '@/store/modules/systemStore/systemStore'
import { SystemStoreEnum } from '@/store/modules/systemStore/systemStore.d'
import { ResultEnum } from '@/enums/httpEnum'
import { ossUrlApi } from '@/api/path'


// * 初始化
export const useSystemInit = async () => {
  const systemStore = useSystemStore()

  // 获取 OSS 信息的 url 地址，用来拼接展示图片的地址
  const getOssUrl = async () => {
    const res = await ossUrlApi({})
    if (res && res.code === ResultEnum.SUCCESS) {
      systemStore.setItem(SystemStoreEnum.FETCH_INFO, {
        OSSUrl: res.data?.bucketURL
      })
    }
  }

  // 执行
  getOssUrl()
}