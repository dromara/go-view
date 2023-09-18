import { echartOptionProfixHandle } from '@/packages/public'

export const includes = ['legend', 'xAxis', 'yAxis', 'grid']

const seriesHandle = (color: string[]) => {
  const numHandle = (numsi: number, i: number) => parseInt(`${numsi * Math.random()}`, 10) * 2
  const nums = [260, 251, 200, 334, 366, 256, 253]

  return color.map((item, index) => ({
    name: `data${index + 1}`,
    type: 'bar',
    data: nums.map((numsItem, numsi) => numHandle(numsItem, index))
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
