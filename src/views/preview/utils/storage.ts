import { getSessionStorage, fetchRouteParamsLocation, httpErrorHandle } from '@/utils'
import { ResultEnum } from '@/enums/httpEnum'
import { StorageEnum } from '@/enums/storageEnum'
import { ChartEditStorage } from '@/store/modules/chartEditStore/chartEditStore.d'
import { fetchProjectApi } from '@/api/path'

export interface ChartEditStorageType extends ChartEditStorage {
  id: string
}

// 根据路由 id 获取存储数据的信息
export const getSessionStorageInfo = async () => {
  const id = fetchRouteParamsLocation()
  const storageList: ChartEditStorageType[] = getSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST)

  // 是否本地预览
  if (!storageList || storageList.findIndex(e => e.id === id.toString()) === -1) {
    // 接口调用
    const res = await fetchProjectApi({ projectId: id })
    if (res && res.code === ResultEnum.SUCCESS) {
      const { content, state } = res.data
      if (state === -1) {
        // 跳转未发布页
        return { isRelease: false }
      }
      return { ...JSON.parse(content), id }
    } else {
      httpErrorHandle()
    }
  } else {
    // 本地读取
    for (let i = 0; i < storageList.length; i++) {
      if (id.toString() === storageList[i]['id']) {
        return storageList[i]
      }
    }
  }
}
