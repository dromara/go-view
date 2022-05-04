import { shallowReactive, ref } from 'vue'
import { icon } from '@/plugins'
import { renderLang, renderIcon } from '@/utils'
import { themeColor, setItem, getCharts } from './useLayout.hook'
import { PackagesCategoryEnum, PackagesCategoryName, PackagesType } from '@/packages/index.d'
// 图表
import { usePackagesStore } from '@/store/modules/packagesStore/packagesStore'
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
// 图标
const { BarChartIcon } = icon.ionicons5
const {
  TableSplitIcon,
  RoadmapIcon,
  SpellCheckIcon,
  GraphicalDataFlowIcon,
} = icon.carbon


// 图表
export type MenuOptionsType = {
  key: string
  icon: ReturnType<typeof renderIcon>
  label: ReturnType<typeof renderLang>
  list: PackagesType
}

const { getPackagesList } = usePackagesStore()
const menuOptions: MenuOptionsType[] = []

const packagesListObj = {
  [PackagesCategoryEnum.CHARTS]: {
    icon: renderIcon(RoadmapIcon),
    label: PackagesCategoryName.CHARTS,
  },
  [PackagesCategoryEnum.INFORMATIONS]: {
    icon: renderIcon(SpellCheckIcon),
    label: PackagesCategoryName.INFORMATIONS,
  },
  [PackagesCategoryEnum.TABLES]: {
    icon: renderIcon(TableSplitIcon),
    label: PackagesCategoryName.TABLES,
  },
  [PackagesCategoryEnum.DECORATES]: {
    icon: renderIcon(GraphicalDataFlowIcon),
    label: PackagesCategoryName.DECORATES,
  },
}

// 处理列表
const handlePackagesList = () => {
  for (const val in getPackagesList) {
    menuOptions.push({
      key: val,
      // @ts-ignore
      icon: packagesListObj[val].icon,
      // @ts-ignore
      label: packagesListObj[val].label,
      // @ts-ignore
      list: getPackagesList[val],
    })
  }
}
handlePackagesList()

// 记录选中值
let beforeSelect: string = menuOptions[0]['key']
const selectValue = ref<string>(menuOptions[0]['key'])

// 选中的对象值
const selectOptions = ref(menuOptions[0])

// 点击 item
const clickItemHandle = (key: string, item: any) => {
  selectOptions.value = item
  // 处理折叠
  if (beforeSelect === key) {
    setItem(ChartLayoutStoreEnum.CHARTS, !getCharts.value)
  } else {
    setItem(ChartLayoutStoreEnum.CHARTS, true)
  }
  beforeSelect = key
}

export {
  getCharts,
  BarChartIcon,
  themeColor,
  selectOptions,
  selectValue,
  clickItemHandle,
  menuOptions,
}
