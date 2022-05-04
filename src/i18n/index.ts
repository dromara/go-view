//语言
import { lang } from '@/settings/designSetting'
import { createI18n } from 'vue-i18n' //引入vue-i18n组件
import { getLocalStorage } from '@/utils'
import { StorageEnum }from '@/enums/storageEnum'
import { LangEnum } from '@/enums/styleEnum'
import { LangStateType } from '@/store/modules/langStore/langStore.d'
import zh from './zh/index'
import en from './en/index'

const langStorage: LangStateType = getLocalStorage(StorageEnum.GO_LANG_STORE)

// 语言数组
export const langList = [
  {
    label: '中文',
    key: LangEnum.ZH
  },
  {
    label: 'English',
    key: LangEnum.EN
  }
]

const i18n = createI18n({
  locale: langStorage?.lang || lang,
  fallbackLocale: langStorage?.lang || lang,
  messages: {
    [LangEnum.ZH]: zh,
    [LangEnum.EN]: en
  }
})

export default i18n
