export type Chartype = {
  id: number | string
  title: string // 标题
  label: string // 标签
  time: string, // 时间
  image: string, // 预览图地址
  createId: string, // 创建者
  release: boolean // false 未发布 | true 已发布
}

export type ChartList = Chartype[]