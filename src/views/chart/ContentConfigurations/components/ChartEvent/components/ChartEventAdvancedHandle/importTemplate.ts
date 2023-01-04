// 获取实例
const eTemplateString = `
console.log(e)
`
// 获取全局 echarts 实例
const echartsTemplateString = `
console.log(echarts)
`

// 获取当前组件图表集合
const componentsTemplateString = `
console.log(components)
`

// 获取 nodeModules 实例
const nodeModulesTemplateString = `
console.log(node_modules)
`

// 添加点击事件
const addClickTemplateString = `
// 在渲染之后才能获取 dom 实例
e.el.addEventListener('click', () => {
  alert('我触发拉~');
}, false)
`

// 异步引入
const importTemplateString = `
await import('https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/lodash.js/4.17.21/lodash.js')

// lodash 默认赋值给 "_"
console.log('isEqual', _.isEqual(['1'], ['1']))
`

// 修改图表 tooltip
const tooltipTemplateString =
  `
// 获取echart实例
const chart = this.refs.vChartRef.chart

// 图表设置tooltip
chart.setOption({
  tooltip: {
    trigger: 'axis', //item
    enterable: true, 
    formatter (params) {
      return` +
  '`' +
  `
        <div>
          <img src="https://portrait.gitee.com/uploads/avatars/user/1654/4964818_MTrun_1653229420.png!avatar30">
          <b><a href="https://gitee.com/dromara/go-view">《这是一个自定义的tooltip》</a></b>
        <div>
        <div style='border-radius:35px;color:#666'>
        ` +
  '$' +
  `{Object.entries(params[0].value).map(kv => ` +
  '`' +
  `<div>` +
  '$' +
  `{kv[0]}:` +
  '$' +
  `{kv[1]}</div>` +
  '`' +
  `).join('')}
        </div>
      ` +
  '`;' +
  `
    },
  }
})
`

// 添加【轮播列表】样式
const addStyleString =
  `
// 组件样式作用域标识
const scoped = this.subTree.scopeId
function loadStyleString(css){
	let style = document.createElement('style')
	style.type = 'text/css'
	style.appendChild(document.createTextNode(css))
	let head = document.getElementsByTagName('head')[0]
	head.appendChild(style)
}
loadStyleString(` +
  '`' +
  `
.dv-scroll-board[` +
  '$' +
  `{scoped}] {
  position: relative;
  overflow: hidden;
}
.dv-scroll-board[` +
  '$' +
  `{scoped}]::before {
  content: '';
  display: block;
  position: absolute;
  top: -20%;
  left: -100%;
  width: 550px;
  height: 60px;
  transform: rotate(-45deg);
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0));
  animation: cross 2s infinite;
}
@keyframes cross{
  to{
    top: 80%;
    left: 100%;
    transform: rotate(-45deg);
  }
}
` +
  '`' +
  `)
`

// 修改地图原点大小
const editMapPointString = `
const chart = this.refs.vChartRef.chart
// 定义地图原点大小 同理可自定义标签等等内容
this.props.chartConfig.option.series[0].symbolSize = (val) => {
  return Math.sqrt(val[2]) / 3;
}
this.setupState.vEchartsSetOption();
let i = 0; // 当前轮播索引
const len = 3; // 轮播部分提示
(function showTips() {
  const action = (type, dataIndex) => {
    chart.dispatchAction({
      type,
      dataIndex,
      seriesIndex: 0,
    });
  }
  setInterval(() => {
    action("downplay", i);
    action("hideTip", i);
    if (i === len) i = 0;
    i++;
    action("highlight", i);
    action("showTip", i);
  }, 2000);
})()
`

export const templateList = [
  {
    description: '获取当前组件实例',
    code: eTemplateString
  },
  {
    description: '获取全局 echarts 实例',
    code: echartsTemplateString
  },
  {
    description: '获取组件图表集合',
    code: componentsTemplateString
  },
  {
    description: '获取 nodeModules 实例',
    code: nodeModulesTemplateString
  },
  {
    description: '获取远程 CDN 库',
    code: importTemplateString
  },
  {
    description: '设置文字组件点击事件',
    code: addClickTemplateString
  },
  {
    description: '修改图表 tooltip',
    code: tooltipTemplateString
  },
  {
    description: '添加【轮播列表】样式',
    code: addStyleString
  },
  {
    description: '修改【地图】圆点，新增提示自动轮播',
    code: editMapPointString
  }
]
