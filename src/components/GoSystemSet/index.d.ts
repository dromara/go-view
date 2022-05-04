export type ListType = {
  key: any
  type: string
  name: string
  desc: string
  value: any
  suffix?: string
  step?: number
  min?: number
  tip?: string
  options?: { label: string; value: any }[]
}
