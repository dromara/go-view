import axiosInstance from './axios'
import { RequestHttpEnum, ContentTypeEnum } from '@/enums/httpEnum'

export const get = (url: string) => {
  return axiosInstance({
    url: url,
    method: RequestHttpEnum.GET,
  })
}

export const post = (url: string, params: object, headersType?: string) => {
  return axiosInstance({
    url: url,
    method: RequestHttpEnum.POST,
    data: params,
    headers: {
      'Content-Type': headersType || ContentTypeEnum.JSON
    }
  })
}

export const del = (url: string, params: object) => {
  return axiosInstance({
    url: url,
    method: RequestHttpEnum.DELETE,
    params
  })
}

// 获取请求函数，默认get
export const http = (type?: RequestHttpEnum) => {
  return type === RequestHttpEnum.GET
    ? get
    : type === RequestHttpEnum.POST
    ? post
    : type === RequestHttpEnum.DELETE
    ? del
    : get
}
