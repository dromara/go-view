import { onUnmounted } from 'vue';
import html2canvas from 'html2canvas'
import { getUUID, httpErrorHandle, fetchRouteParamsLocation, base64toFile } from '@/utils'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasTypeEnum, ChartEditStoreEnum, ProjectInfoEnum, ChartEditStorage } from '@/store/modules/chartEditStore/chartEditStore.d'
import { useChartHistoryStore } from '@/store/modules/chartHistoryStore/chartHistoryStore'
import { useSystemStore } from '@/store/modules/systemStore/systemStore'
import { fetchChartComponent, fetchConfigComponent, createComponent } from '@/packages/index'
import { saveInterval } from '@/settings/designSetting'
import throttle from 'lodash/throttle'
// 接口状态
import { ResultEnum } from '@/enums/httpEnum'
// 接口
import { saveProjectApi, fetchProjectApi, uploadFile, updateProjectApi } from '@/api/path'
// 画布枚举
import { SyncEnum } from '@/enums/editPageEnum'
import { CreateComponentType, CreateComponentGroupType, ConfigType } from '@/packages/index.d'
import { PublicGroupConfigClass } from '@/packages/public/publicConfig'

// 请求处理
export const useSync = () => {
  const chartEditStore = useChartEditStore()
  const chartHistoryStore = useChartHistoryStore()
  const systemStore = useSystemStore()

  /**
   * * 组件动态注册
   * @param projectData 项目数据
   * @param isReplace 是否替换数据
   * @returns
   */
  const updateComponent = async (projectData: ChartEditStorage, isReplace = false, changeId = false) => {
    if (isReplace) {
      // 清除列表
      chartEditStore.componentList = []
      // 清除历史记录
      chartHistoryStore.clearBackStack()
      chartHistoryStore.clearForwardStack()
    }
    // 列表组件注册
    projectData.componentList.forEach(async (e: CreateComponentType | CreateComponentGroupType) => {
      const intComponent = (target: CreateComponentType) => {
        if (!window['$vue'].component(target.chartConfig.chartKey)) {
          window['$vue'].component(target.chartConfig.chartKey, fetchChartComponent(target.chartConfig))
          window['$vue'].component(target.chartConfig.conKey, fetchConfigComponent(target.chartConfig))
        }
      }

      if (e.isGroup) {
        ;(e as CreateComponentGroupType).groupList.forEach(groupItem => {
          intComponent(groupItem)
        })
      } else {
        intComponent(e as CreateComponentType)
      }
    })
    // 数据赋值
    for (const key in projectData) {
      // 组件
      if (key === ChartEditStoreEnum.COMPONENT_LIST) {
        for (const comItem of projectData[key]) {
          // 重新创建是为了处理类种方法消失的问题
          const create = async (
            _componentInstance: CreateComponentType,
            callBack?: (componentInstance: CreateComponentType) => void
          ) => {
            // 补充 class 上的方法
            let newComponent: CreateComponentType = await createComponent(_componentInstance.chartConfig)
            if (callBack) {
              if (changeId) {
                callBack(Object.assign(newComponent, { ..._componentInstance, id: getUUID() }))
              } else {
                callBack(Object.assign(newComponent, _componentInstance))
              }
            } else {
              if (changeId) {
                chartEditStore.addComponentList(
                  Object.assign(newComponent, { ..._componentInstance, id: getUUID() }),
                  false,
                  true
                )
              } else {
                chartEditStore.addComponentList(Object.assign(newComponent, _componentInstance), false, true)
              }
            }
          }

          if (comItem.isGroup) {
            // 创建分组
            let groupClass = new PublicGroupConfigClass()
            if (changeId) {
              groupClass = Object.assign(groupClass, { ...comItem, id: getUUID() })
            } else {
              groupClass = Object.assign(groupClass, comItem)
            }

            // 注册子应用
            const targetList: CreateComponentType[] = []
            ;(comItem as CreateComponentGroupType).groupList.forEach(groupItem => {
              create(groupItem, e => {
                targetList.push(e)
              })
            })
            groupClass.groupList = targetList

            // 分组插入到列表
            chartEditStore.addComponentList(groupClass, false, true)
          } else {
            create(comItem as CreateComponentType)
          }
        }
      } else {
        // 非组件(顺便排除脏数据)
        if (key !== 'editCanvasConfig' && key !== 'requestGlobalConfig') return
        Object.assign(chartEditStore[key], projectData[key])
      }
    }
  }

  /**
   * * 赋值全局数据
   * @param projectData 项目数据
   * @returns 
   */
  const updateStoreInfo = (projectData: {
    id: string,
    projectName: string,
    indexImage: string,
    remarks: string,
    state: number
  }) => {
    const { projectName, remarks, indexImage, state } = projectData
    // 名称
    chartEditStore.setProjectInfo(ProjectInfoEnum.PROJECT_NAME, projectName)
    // 描述
    chartEditStore.setProjectInfo(ProjectInfoEnum.REMARKS, remarks)
    // 缩略图
    chartEditStore.setProjectInfo(ProjectInfoEnum.THUMBNAIL, indexImage)
    // 发布
    chartEditStore.setProjectInfo(ProjectInfoEnum.RELEASE, state === 1)
  }

  // * 数据获取
  const dataSyncFetch = async () => {
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.SAVE_STATUS, SyncEnum.START)
    try {
      const res = await fetchProjectApi({ projectId: fetchRouteParamsLocation() }) as unknown as MyResponseType
      if (res.code === ResultEnum.SUCCESS) {
        if (res.data) {
          updateStoreInfo(res.data)
          // 更新全局数据
          await updateComponent(JSON.parse(res.data.content))
          return
        }
        setTimeout(() => {
          chartEditStore.setEditCanvas(EditCanvasTypeEnum.SAVE_STATUS, SyncEnum.SUCCESS)
        }, 1000)
        return
      }
      chartEditStore.setEditCanvas(EditCanvasTypeEnum.SAVE_STATUS, SyncEnum.FAILURE)
    } catch (error) {
      chartEditStore.setEditCanvas(EditCanvasTypeEnum.SAVE_STATUS, SyncEnum.FAILURE)
      httpErrorHandle()
    }
  }

  // * 数据保存
  const dataSyncUpdate = throttle(async () => {
    if(!fetchRouteParamsLocation()) return

    if(!systemStore.getFetchInfo.OSSUrl) {
      window['$message'].error('数据保存失败，请刷新页面重试！')
      return
    }

    chartEditStore.setEditCanvas(EditCanvasTypeEnum.SAVE_STATUS, SyncEnum.START)

    // 获取缩略图片
    const range = document.querySelector('.go-edit-range') as HTMLElement
    // 生成图片
    const canvasImage: HTMLCanvasElement = await html2canvas(range, {
      backgroundColor: null,
      allowTaint: true,
      useCORS: true
    })
    
    // 上传预览图
    let uploadParams = new FormData()
    uploadParams.append('object', base64toFile(canvasImage.toDataURL(), `${fetchRouteParamsLocation()}_index_preview.png`))
    const uploadRes = await uploadFile(systemStore.getFetchInfo.OSSUrl, uploadParams) as unknown as MyResponseType
    // 保存预览图
    if(uploadRes.code === ResultEnum.SUCCESS) {
      await updateProjectApi({
        id: fetchRouteParamsLocation(),
        indexImage: uploadRes.data.objectContent.httpRequest.uri
      })
    }

    // 保存数据
    let params = new FormData()
    params.append('projectId', fetchRouteParamsLocation())
    params.append('content', JSON.stringify(chartEditStore.getStorageInfo || {}))
    const res= await saveProjectApi(params) as unknown as MyResponseType

    if (res.code === ResultEnum.SUCCESS) {
      // 成功状态
      setTimeout(() => {
        chartEditStore.setEditCanvas(EditCanvasTypeEnum.SAVE_STATUS, SyncEnum.SUCCESS)
      }, 1000)
      return
    }
    // 失败状态
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.SAVE_STATUS, SyncEnum.FAILURE)
  }, 3000)

  // * 定时处理
  const intervalDataSyncUpdate = () => {
    // 定时获取数据
    const syncTiming = setInterval(() => {
      dataSyncUpdate()
    }, saveInterval * 1000)

    // 销毁
    onUnmounted(() => {
      clearInterval(syncTiming)
    })
  }

  return {
    updateComponent,
    updateStoreInfo,
    dataSyncFetch,
    dataSyncUpdate,
    intervalDataSyncUpdate
  }
}
