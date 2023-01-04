import { defineStore } from 'pinia'
import { lang } from '@/settings/designSetting'
import { LangStateType } from './langStore.d'
import { LangEnum } from '@/enums/styleEnum'
import i18n from '@/i18n/index'
import { setLocalStorage, getLocalStorage, reloadRoutePage } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { useSettingStore } from '@/store/modules/settingStore/settingStore'

const { GO_LANG_STORE } = StorageEnum
const storageLang: LangStateType = getLocalStorage(GO_LANG_STORE)

// 语言
export const useLangStore = defineStore({
  id: 'useLangStore',
  state: (): LangStateType =>
    storageLang || {
      lang
    },
  getters: {
    getLang(): LangEnum {
      return this.lang
    }
  },
  actions: {
    changeLang(lang: LangEnum): void {
      const settingStore = useSettingStore()
      
      if (this.lang === lang) return
      this.lang = lang
      i18n.global.locale = lang
      setLocalStorage(GO_LANG_STORE, this.$state)

      if (settingStore.getChangeLangReload) {
        reloadRoutePage()
      }
    }
  }
})
