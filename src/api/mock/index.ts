import test from './test.mock'
import { MockMethod } from 'vite-plugin-mock'
import { RequestHttpEnum } from '@/enums/httpEnum'

// 单个X数据
export const chartDataUrl = '/mock/chartData'
export const chartSingleDataUrl = '/mock/chartSingleData'
export const numberFloatUrl = '/mock/number/float'
export const numberIntUrl = '/mock/number/int'
export const textUrl = '/mock/text'
export const imageUrl = '/mock/image'
export const rankListUrl = '/mock/rankList'
export const scrollBoardUrl = '/mock/scrollBoard'
export const radarUrl = '/mock/radarData'

const mockObject: MockMethod[] = [
  {
    // 正则
    // url: /\/mock\/mockData(|\?\S*)$/,
    url: chartDataUrl,
    method: RequestHttpEnum.GET,
    response: () => test.fetchMockData
  },
  {
    url: chartSingleDataUrl,
    method: RequestHttpEnum.GET,
    response: () => test.fetchMockSingleData
  },
  {
    url: numberFloatUrl,
    method: RequestHttpEnum.GET,
    response: () => test.fetchNumberFloat
  },
  {
    url: numberIntUrl,
    method: RequestHttpEnum.GET,
    response: () => test.fetchNumberInt
  },
  {
    url: textUrl,
    method: RequestHttpEnum.GET,
    response: () => test.fetchText
  },
  {
    url: imageUrl,
    method: RequestHttpEnum.GET,
    response: () => test.fetchImage(Math.round(Math.random() * 10))
  },
  {
    url: rankListUrl,
    method: RequestHttpEnum.GET,
    response: () => test.fetchRankList
  },
  {
    url: scrollBoardUrl,
    method: RequestHttpEnum.GET,
    response: () => test.fetchScrollBoard
  },
  {
    url: radarUrl,
    method: RequestHttpEnum.GET,
    response: () => test.fetchRadar
  },
]

export default mockObject
