import { ref, nextTick } from 'vue'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { CreateComponentType } from '@/packages/index.d'
import { renderIcon, loadingError } from '@/utils'
import { icon } from '@/plugins'
import { MenuOptionsItemType } from './useContextMenu.hook.d'
import { MenuEnum } from '@/enums/editPageEnum'

const {
  CopyIcon,
  CutIcon,
  ClipboardOutlineIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} = icon.ionicons5
const { UpToTopIcon, DownToBottomIcon, PaintBrushIcon } = icon.carbon

const chartEditStore = useChartEditStore()

// * 默认选项
const defaultOptions: MenuOptionsItemType[] = [
  {
    label: '复制',
    key: MenuEnum.COPY,
    icon: renderIcon(CopyIcon),
    fnHandle: chartEditStore.setCopy,
  },
  {
    label: '剪切',
    key: MenuEnum.CUT,
    icon: renderIcon(CutIcon),
    fnHandle: chartEditStore.setCut,
  },
  {
    label: '粘贴',
    key: MenuEnum.PARSE,
    icon: renderIcon(ClipboardOutlineIcon),
    fnHandle: chartEditStore.setParse,
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    label: '置顶',
    key: MenuEnum.TOP,
    icon: renderIcon(UpToTopIcon),
    fnHandle: chartEditStore.setTop,
  },
  {
    label: '置底',
    key: MenuEnum.BOTTOM,
    icon: renderIcon(DownToBottomIcon),
    fnHandle: chartEditStore.setBottom,
  },
  {
    label: '上移一层',
    key: MenuEnum.UP,
    icon: renderIcon(ChevronUpIcon),
    fnHandle: chartEditStore.setUp,
  },
  {
    label: '下移一层',
    key: MenuEnum.DOWN,
    icon: renderIcon(ChevronDownIcon),
    fnHandle: chartEditStore.setDown,
  },
  {
    type: 'divider',
    key: 'd2',
  },
  {
    label: '清空剪贴板',
    key: MenuEnum.CLEAR,
    icon: renderIcon(PaintBrushIcon),
    fnHandle: chartEditStore.setRecordChart,
  },
  {
    label: '删除',
    key: MenuEnum.DELETE,
    icon: renderIcon(TrashIcon),
    fnHandle: chartEditStore.removeComponentList,
  },
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
  return options.filter((op: MenuOptionsItemType) => {
    return pickList.findIndex((e: MenuEnum) => e === op.key) !== -1
  })
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
  item?: CreateComponentType,
  // 判断函数
  optionsHandle?: Function,
  // 隐藏选项列表
  hideOptionsList?: MenuEnum[],
  // 挑选选项列表
  pickOptionsList?: MenuEnum[],
) => {
  e.stopPropagation()
  e.preventDefault()
  let target = e.target
  while (target instanceof SVGElement) {
    target = target.parentNode
  }
  chartEditStore.setRightMenuShow(false)

  // * 设置默认选项
  menuOptions.value = defaultOptions

  if (!item) {
    menuOptions.value = pickOption(menuOptions.value, defaultNoItemKeys)
  }
  if (hideOptionsList) {
    menuOptions.value = hideOption(menuOptions.value, hideOptionsList)
  }
  if (pickOptionsList) {
    menuOptions.value = hideOption(menuOptions.value, pickOptionsList)
  }
  if (optionsHandle) {
    menuOptions.value = optionsHandle(menuOptions.value)
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
    const targetItem: MenuOptionsItemType[] = menuOptions.value.filter(
      (e: MenuOptionsItemType) => e.key === key
    )

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
    handleContextMenu,
    onClickOutSide,
    handleMenuSelect,
    mousePosition: chartEditStore.getMousePosition,
  }
}
