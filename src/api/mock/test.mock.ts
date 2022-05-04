export default {
  // 图表
  fetchMockData: {
    status: 200,
    msg: '请求成功',
    data: {
      dimensions: ['product', 'dataOne', 'dataTwo'],
      source: [
        {
          product: '@name',
          'dataOne|100-900': 3,
          'dataTwo|100-900': 3,
        },
        {
          product: '@name',
          'dataOne|100-900': 3,
          'dataTwo|100-900': 3,
        },
        {
          product: '@name',
          'dataOne|100-900': 3,
          'dataTwo|100-900': 3,
        },
        {
          product: '@name',
          'dataOne|100-900': 3,
          'dataTwo|100-900': 3,
        },
        {
          product: '@name',
          'dataOne|100-900': 3,
          'dataTwo|100-900': 3,
        },
        {
          product: '@name',
          'dataOne|100-900': 3,
          'dataTwo|100-900': 3,
        },
      ],
    },
  },
  // 排名列表
  fetchRankList: {
    status: 200,
    msg: '请求成功',
    data: [
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
      { name: '@name', 'value|100-900': 5 },
    ],
  },
  // 获取数字
  fetchNumber: {
    status: 200,
    msg: '请求成功',
    data: '@float(0, 0.99)',
  },
}
