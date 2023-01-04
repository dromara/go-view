import { ref, nextTick, toRaw } from 'vue'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { renderIcon, loadingError } from '@/utils'
import { icon } from '@/plugins'
import { MenuOptionsItemType } from './useContextMenu.hook.d'
import { MenuEnum } from '@/enums/editPageEnum'
import cloneDeep from 'lodash/cloneDeep'

const {
  CopyIcon,
  CutIcon,
  ClipboardOutlineIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LockOpenOutlineIcon,
  LockClosedOutlineIcon,
  EyeOutlineIcon,
  EyeOffOutlineIcon
} = icon.ionicons5
const { UpToTopIcon, DownToBottomIcon, PaintBrushIcon, Carbon3DSoftwareIcon, Carbon3DCursorIcon } = icon.carbon

const chartEditStore = useChartEditStore()

/**
 * 分割线
 * @param {number} n > 2
 * @returns
 */
export const divider = (n: number = 3) => {
  return {
    type: 'divider',
    key: `d${n}`
  }
}

// * 默认单组件选项
export const defaultOptions: MenuOptionsItemType[] = [
  {
    label: '锁定',
    key: MenuEnum.LOCK,
    icon: renderIcon(LockClosedOutlineIcon),
    fnHandle: chartEditStore.setLock
  },
  {
    label: '解锁',
    key: MenuEnum.UNLOCK,
    icon: renderIcon(LockOpenOutlineIcon),
    fnHandle: chartEditStore.setUnLock
  },
  {
    label: '隐藏',
    key: MenuEnum.HIDE,
    icon: renderIcon(EyeOffOutlineIcon),
    fnHandle: chartEditStore.setHide
  },
  {
    label: '显示',
    key: MenuEnum.SHOW,
    icon: renderIcon(EyeOutlineIcon),
    fnHandle: chartEditStore.setShow
  },
  {
    type: 'divider',
    key: 'd0'
  },
  {
    label: '复制',
    key: MenuEnum.COPY,
    icon: renderIcon(CopyIcon),
    fnHandle: chartEditStore.setCopy
  },
  {
    label: '剪切',
    key: MenuEnum.CUT,
    icon: renderIcon(CutIcon),
    fnHandle: chartEditStore.setCut
  },
  {
    label: '粘贴',
    key: MenuEnum.PARSE,
    icon: renderIcon(ClipboardOutlineIcon),
    fnHandle: chartEditStore.setParse
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '置顶',
    key: MenuEnum.TOP,
    icon: renderIcon(UpToTopIcon),
    fnHandle: chartEditStore.setTop
  },
  {
    label: '置底',
    key: MenuEnum.BOTTOM,
    icon: renderIcon(DownToBottomIcon),
    fnHandle: chartEditStore.setBottom
  },
  {
    label: '上移',
    key: MenuEnum.UP,
    icon: renderIcon(ChevronUpIcon),
    fnHandle: chartEditStore.setUp
  },
  {
    label: '下移',
    key: MenuEnum.DOWN,
    icon: renderIcon(ChevronDownIcon),
    fnHandle: chartEditStore.setDown
  },
  {
    type: 'divider',
    key: 'd2'
  },
  {
    label: '清空剪贴板',
    key: MenuEnum.CLEAR,
    icon: renderIcon(PaintBrushIcon),
    fnHandle: chartEditStore.setRecordChart
  },
  {
    label: '删除',
    key: MenuEnum.DELETE,
    icon: renderIcon(TrashIcon),
    fnHandle: chartEditStore.removeComponentList
  }
]

// * 默认多选组件选项
export const defaultMultiSelectOptions: MenuOptionsItemType[] = [
  {
    label: '创建分组',
    key: MenuEnum.GROUP,
    icon: renderIcon(Carbon3DSoftwareIcon),
    fnHandle: chartEditStore.setGroup
  },
  {
    label: '解除分组',
    key: MenuEnum.UN_GROUP,
    icon: renderIcon(Carbon3DCursorIcon),
    fnHandle: chartEditStore.setUnGroup
  }
]

// * 无数据传递拥有的选项
const defaultNoItemKeys = [MenuEnum.PARSE, MenuEnum.CLEAR]

/**
 * * 挑选选项
 * @param options
 * @param pickList
 * @returns
 */
const pickOption = (options: MenuOptionsItemType[], pickList?: MenuEnum[]) => {
  if (!pickList) return options
  const list: MenuOptionsItemType[] = []
  pickList.forEach(e => {
    list.push(...options.filter(op => op.key === e))
  })
  return list
}

/**
 * * 去除选项
 * @param options
 * @param hideList
 * @returns
 */
const hideOption = (options: MenuOptionsItemType[], hideList?: MenuEnum[]) => {
  if (!hideList) return options
  return options.filter((op: MenuOptionsItemType) => {
    return hideList.findIndex((e: MenuEnum) => e !== op.key) !== -1
  })
}

// * 右键内容
const menuOptions = ref<MenuOptionsItemType[]>([])

// * 右键处理
const handleContextMenu = (
  e: MouseEvent,
  // 右键对象
  targetInstance?: CreateComponentType | CreateComponentGroupType,
  // 判断函数
  optionsHandle?: Function,
  // 隐藏选项列表
  hideOptionsList?: MenuEnum[],
  // 挑选选项列表
  pickOptionsList?: MenuEnum[]
) => {
  e.stopPropagation()
  e.preventDefault()

  let target = e.target
  while (target instanceof SVGElement) {
    target = target.parentNode
  }

  chartEditStore.setTargetSelectChart(targetInstance && targetInstance.id)

  // 隐藏旧列表
  chartEditStore.setRightMenuShow(false)

  // * 多选默认选项
  if (chartEditStore.getTargetChart.selectId.length > 1) {
    menuOptions.value = defaultMultiSelectOptions
  } else {
    // * 单选默认选项
    menuOptions.value = defaultOptions
  }

  if (!targetInstance) {
    menuOptions.value = pickOption(toRaw(menuOptions.value), defaultNoItemKeys)
  }
  if (hideOptionsList) {
    menuOptions.value = hideOption([...defaultMultiSelectOptions, divider(), ...defaultOptions], hideOptionsList)
  }
  if (pickOptionsList) {
    menuOptions.value = pickOption([...defaultMultiSelectOptions, divider(), ...defaultOptions], pickOptionsList)
  }
  if (optionsHandle) {
    // 自定义函数能够拿到当前选项和所有选项
    menuOptions.value = optionsHandle(
      cloneDeep(toRaw(menuOptions.value)),
      [...defaultMultiSelectOptions, ...defaultOptions],
      targetInstance
    )
  }
  nextTick().then(() => {
    chartEditStore.setMousePosition(e.clientX, e.clientY)
    chartEditStore.setRightMenuShow(true)
  })
}

/**
 * * 右键hook
 * @param menuConfig
 * @returns
 */
export const useContextMenu = () => {
  // 设置默认项
  menuOptions.value = defaultOptions

  // * 失焦
  const onClickOutSide = () => {
    chartEditStore.setRightMenuShow(false)
  }

  // * 事件处理
  const handleMenuSelect = (key: string) => {
    chartEditStore.setRightMenuShow(false)
    const targetItem: MenuOptionsItemType[] = menuOptions.value.filter((e: MenuOptionsItemType) => e.key === key)

    menuOptions.value.forEach((e: MenuOptionsItemType) => {
      if (e.key === key) {
        if (e.fnHandle) {
          e.fnHandle()
          return
        }
        if (!targetItem) loadingError()
      }
    })
  }

  return {
    menuOptions,
    defaultOptions,
    defaultMultiSelectOptions,
    handleContextMenu,
    onClickOutSide,
    handleMenuSelect,
    mousePosition: chartEditStore.getMousePosition
  }
}
