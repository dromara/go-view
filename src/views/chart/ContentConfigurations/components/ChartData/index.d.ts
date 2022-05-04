import { RequestHttpEnum, RequestDataTypeEnum } from '@/enums/httpEnum'

// 匹配结果
export enum DataResultEnum {
  NULL = 0,
  SUCCESS = 1,
  FAILURE = 2,
}

export enum TimelineTitleEnum {
  MAPPING = '数据映射',
  CONTENT = '数据内容',
}

export enum SelectCreateDataEnum {
  STATIC = '静态数据',
  AJAX = '动态请求',
}

export interface SelectCreateDataType {
  label: SelectCreateDataEnum
  value: RequestDataTypeEnum
  disabled?: boolean
}

// ajax 请求
export interface SelectHttpType {
  label: RequestHttpEnum
  value: RequestHttpEnum
  disabled?: boolean
}
