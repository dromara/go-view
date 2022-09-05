import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { canvasCut, downloadTextFile } from '@/utils'
const chartEditStore = useChartEditStore()

// 导出
export const exportHandle = () => {
  // 取消选中
  chartEditStore.setTargetSelectChart(undefined)

  // 导出数据
  downloadTextFile(
    JSON.stringify(chartEditStore.getStorageInfo || [], (k, v) => {
      return v === undefined ? null : v
    }),
    undefined,
    'json'
  )

  // 导出图片
  const range = document.querySelector('.go-edit-range') as HTMLElement
  const watermark = document.getElementById('go-edit-watermark')
  // 隐藏边距线
  if (!range || !watermark) {
    window['$message'].error('导出失败！')
    return
  }

  // 记录缩放比例
  const scaleTemp = chartEditStore.getEditCanvas.scale
  // 百分百展示页面
  chartEditStore.setScale(1, true)
  // 展示水印
  watermark.style.display = 'block'

  setTimeout(() => {
    canvasCut(range, () => {
      // 隐藏水印
      if (watermark) watermark.style.display = 'none'
      // 还原页面大小
      chartEditStore.setScale(scaleTemp, true)
    })
  }, 600)
}
