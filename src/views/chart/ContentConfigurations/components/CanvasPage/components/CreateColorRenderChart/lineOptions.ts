import { echartOptionProfixHandle } from '@/packages/public'
import { graphic } from 'echarts/core'
import { fade, hslToHex } from '@/utils'

export const includes = ['legend', 'xAxis', 'yAxis', 'grid']

const seriesHandle = (color: string[]) => {
  const numHandle = (numsi: number, i: number) => parseInt(`${numsi * Math.random()}`, 10) * 2
  const nums = [130, 251, 200, 334, 366, 456, 223]

  return color.map((item, index) => ({
    name: `data${index + 1}`,
    type: 'line',
    smooth: true,
    lineStyle: {
      width: 1,
      type: 'solid'
    },
    emphasis: {
      focus: 'series'
    },
    areaStyle: {
      opacity: 0.8,
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 1,
          color: item
        },
        {
          offset: 0,
          color: item
        }
      ])
    },
    showSymbol: false,
    data: nums.reverse().map((numsItem, numsi) => numHandle(numsItem, index))
  }))
}

export const option = (color: string[]) => {
  return echartOptionProfixHandle(
    {
      tooltip: {
        trigger: 'axis',
        showContent: false,
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: color.map((e, i) => `data${i + 1}`),
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        show: true,
        type: 'value'
      },
      series: seriesHandle(color || [])
    },
    includes
  )
}
