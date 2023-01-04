import image from '@/assets/images/chart/decorates/threeEarth01.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const ThreeEarth01Config: ConfigType = {
  key: 'ThreeEarth01',
  chartKey: 'VThreeEarth01',
  conKey: 'VCThreeEarth01',
  title: '三维地球',
  category: ChatCategoryEnum.THREE,
  categoryName: ChatCategoryEnumName.THREE,
  package: PackagesCategoryEnum.DECORATES,
  chartFrame: ChartFrameEnum.STATIC,
  image
}
