import Configuration from './config.vue'
import image from '@/assets/images/chart/informations/words_cloud.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const TextCloudConfig: ConfigType = {
  key: 'TextCloud',
  chartKey: 'VTextCloud',
  conKey: 'VCTextCloud',
  title: '词云',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.INFORMATIONS,
  image
}
