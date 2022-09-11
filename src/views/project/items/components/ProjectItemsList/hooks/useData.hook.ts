import { ref, reactive } from 'vue';
import { goDialog, httpErrorHandle } from '@/utils'
import { DialogEnum } from '@/enums/pluginEnum'
import { projectListApi, deleteProjectApi, changeProjectReleaseApi } from '@/api/path'
import { Chartype, ChartList } from '../../../index.d'
import { ResultEnum } from '@/enums/httpEnum'

// 数据初始化
export const useDataListInit = () => {

  const loading = ref(true)

  const paginat = reactive({
    // 当前页数 
    page: 1,
    // 每页值
    limit: 12,
    // 总数
    count: 10,
  })

  const list = ref<ChartList>([])

  // 数据请求
  const fetchList = async () => {
    loading.value = true
    const res = await projectListApi({
      page: paginat.page,
      limit: paginat.limit
    }) as any
    if (res.data) {
      const { count } = res
      paginat.count = count
      list.value = res.data.map((e: any) => {
        const { id, projectName, state, createTime, indexImage, createUserId } = e
        return {
          id: id,
          title: projectName,
          createId: createUserId,
          time: createTime,
          image: indexImage,
          release: state !== -1
        }
      })
      setTimeout(() => {
        loading.value = false
      }, 500)
      return
    }
    httpErrorHandle()
  }

  // 修改页数
  const changePage = (_page: number) => {
    paginat.page = _page
    fetchList()
  }

  // 修改大小
  const changeSize = (_size: number) => {
    paginat.limit = _size
    fetchList()
  }

  // 删除处理
  const deleteHandle = (cardData: Chartype) => {
    goDialog({
      type: DialogEnum.DELETE,
      promise: true,
      onPositiveCallback: () => new Promise(res => {
        res(deleteProjectApi({
          ids: cardData.id
        }))
      }),
      promiseResCallback: (res: any) => {
        if (res.code === ResultEnum.SUCCESS) {
          window['$message'].success(window['$t']('global.r_delete_success'))
          fetchList()
          return
        }
        httpErrorHandle()
      }
    })
  }

  // 发布处理
  const releaseHandle = async (cardData: Chartype, index: number) => {
    const { id, release } = cardData
    const res = await changeProjectReleaseApi({
      id: id,
      // [-1未发布, 1发布]
      state: !release ? 1 : -1
    }) as unknown as MyResponseType
    if (res.code === ResultEnum.SUCCESS) {
      list.value = []
      fetchList()
      // 发布 -> 未发布
      if (release) {
        window['$message'].success(window['$t']('global.r_unpublish_success'))
        return
      }
      // 未发布 -> 发布
      window['$message'].success(window['$t']('global.r_publish_success'))
      return
    }
    httpErrorHandle()
  }

  // 立即请求
  fetchList()

  return {
    loading,
    paginat,
    list,
    fetchList,
    releaseHandle,
    changeSize,
    changePage,
    deleteHandle
  }
}
