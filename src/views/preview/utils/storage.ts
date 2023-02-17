import { getSessionStorage } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { ChartEditStorage } from '@/store/modules/chartEditStore/chartEditStore.d'

export interface ChartEditStorageType extends ChartEditStorage {
  id: string
}

// 根据路由 id 获取存储数据的信息
export const getSessionStorageInfo = () => {
  const urlHash = document.location.hash
  const toPathArray = urlHash.split('/')
  const id = toPathArray && toPathArray[toPathArray.length - 1]

  const storageList: ChartEditStorageType[] = getSessionStorage(
    StorageEnum.GO_CHART_STORAGE_LIST
  )

  if(!storageList) return

  for (let i = 0; i < storageList.length; i++) {
    if (id.toString() === storageList[i]['id']) {
      return storageList[i]
    }
  }
}