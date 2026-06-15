import './style.css'
import * as echarts from 'echarts'
import { monthlySales } from './data.js'

const months = monthlySales.map((d) => d.month)
const sales = monthlySales.map((d) => d.sales)

const chartDom = document.getElementById('chart')
const myChart = echarts.init(chartDom)

const option = {
  title: {
    text: '2025年淘宝运动鞋月度销量',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    valueFormatter: (value) => value + ' 百万',
  },
  xAxis: {
    type: 'category',
    data: months,
  },
  yAxis: {
    type: 'value',
    name: '销量（百万）',
  },
  series: [
    {
      name: '销量',
      type: 'bar',
      data: sales,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 1, color: '#188df0' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
}

myChart.setOption(option)

window.addEventListener('resize', () => {
  myChart.resize()
})
