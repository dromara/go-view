import customed from './themes/customed.json'
import dark from './themes/dark.json'
import chalk from './themes/chalk.json'
import essos from './themes/essos.json'
import macarons from './themes/macarons.json'
import purplePassion from './themes/purple-passion.json'
import roma from './themes/roma.json'
import shine from './themes/shine.json'
import vintage from './themes/vintage.json'
import walden from './themes/walden.json'
import westeros from './themes/westeros.json'
import wonderland from './themes/wonderland.json'
// 默认主题详细配置
import themeJson from './global.theme.json'

export const chartColors = {
  dark,
  customed,
  macarons,
  walden,
  purplePassion,
  vintage,
  chalk,
  westeros,
  wonderland,
  essos,
  shine,
  roma
}

// 默认主题
export const defaultTheme = 'dark'

// 主题色列表
export type ChartColorsNameType = keyof typeof chartColorsName
export const chartColorsName = {
  dark: '明亮',
  customed: '暗淡',
  macarons: '马卡龙',
  walden: '蓝绿',
  purplePassion: '深紫',
  vintage: '复古',
  chalk: '粉青',
  westeros: '灰粉',
  wonderland: '青草',
  essos: '橘红',
  shine: '深色',
  roma: '罗马红'
}

// 主题色列表
export const chartColorsshow = {
  dark: 'linear-gradient(to right, #4992ff 0%, #7cffb2 100%)',
  customed: 'linear-gradient(to right, #5470c6 0%, #91cc75 100%)',
  macarons: 'linear-gradient(to right, #2ec7c9 0%, #b6a2de 100%)',
  walden: 'linear-gradient(to right, #3fb1e3 0%, #6be6c1 100%)',
  purplePassion: 'linear-gradient(to right, #9b8bba 0%, #e098c7 100%)',
  vintage: 'linear-gradient(to right, #d87c7c 0%, #919e8b 100%)',
  chalk: 'linear-gradient(to right, #fc97af 0%, #87f7cf 100%)',
  westeros: 'linear-gradient(to right, #516b91 0%, #edafda 100%)',
  wonderland: 'linear-gradient(to right, #4ea397 0%, #22c3aa 100%)',
  essos: 'linear-gradient(to right, #893448 0%, #d95850 100%)',
  shine: 'linear-gradient(to right, #c12e34 0%, #0098d9 100%)',
  roma: 'linear-gradient(to right, #e01f54 0%, #5e4ea5 100%)'
}
// 渐变主题色列表（主色1、主色2、阴影、渐变1、渐变2）
export const chartColorsSearch = {
  dark: ['#4992ff', '#7cffb2', 'rgba(68, 181, 226, 0.3)', 'rgba(73, 146, 255, 0.5)', 'rgba(124, 255, 178, 0.5)'],
  customed: ['#5470c6', '#91cc75', 'rgba(84, 112, 198, 0.5)', 'rgba(84, 112, 198, 0.5)', 'rgba(145, 204, 117, 0.5)'],
  macarons: ['#2ec7c9', '#b6a2de', 'rgba(182, 162, 222, 0.3)', 'rgba(46, 199, 201, 0.5)', 'rgba(182, 162, 222, 0.5)'],

  walden: ['#3fb1e3', '#6be6c1', 'rgba(68, 181, 226, 0.3)', 'rgba(63, 177, 227, 0.5)', 'rgba(107, 230, 193, 0.5)'],
  purplePassion: ['#9b8bba', '#e098c7', 'rgba(182, 162, 222, 0.3)', 'rgba(155, 139, 186, 0.5)', 'rgba(237, 175, 218, 0.5)'],
  vintage: ['#d87c7c', '#919e8b', 'rgba(182, 162, 222, 0.3)', 'rgba(216, 124, 124, 0.5)', 'rgba(145, 158, 139, 0.5)'],

  chalk: ['#fc97af', '#87f7cf', 'rgba(135, 247, 207, 0.3)', 'rgba(252, 151, 175, 0.5)', 'rgba(135, 247, 207, 0.5)'],
  westeros: ['#516b91', '#edafda', 'rgba(81, 107, 145, 0.3)', 'rgba(81, 107, 145, 0.5)', 'rgba(89, 196, 230, 0.5)'],
  wonderland: ['#4ea397', '#22c3aa', 'rgba(68, 181, 226, 0.3)', 'rgba(78, 163, 151, 0.5)', 'rgba(34, 195, 170, 0.5)'],
  
  essos: ['#893448', '#d95850', 'rgba(137, 52, 72, 0.3)', 'rgba(137, 52, 72, 0.5)', 'rgba(217, 88, 80, 0.5)'],
  shine: ['#c12e34', '#0098d9', 'rgba(137, 52, 72, 0.3)', 'rgba(193, 46, 52, 0.5)', 'rgba(230, 182, 0, 0.5)'],
  roma: ['#e01f54', '#5e4ea5', 'rgba(137, 52, 72, 0.3)', 'rgba(224, 31, 84, 0.5)', 'rgba(94, 78, 165, 0.5)'],
}

// 默认主题详细配置
type ThemeJsonType = typeof themeJson
export interface GlobalThemeJsonType extends Partial<ThemeJsonType> {
  dataset?: any,
  [T:string]: any
}
export const globalThemeJson = {...themeJson, dataset: null,}
