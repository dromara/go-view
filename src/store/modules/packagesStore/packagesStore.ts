import { defineStore } from 'pinia'
import { PackagesStoreType, PackagesType } from './packagesStore.d'
import { packagesList } from '@/packages/index'

// 组件 pakages
export const usePackagesStore = defineStore({
  id: 'usePackagesStore',
  state: (): PackagesStoreType => ({
    packagesList: Object.freeze(packagesList)
  }),
  getters: {
    getPackagesList(): PackagesType {
      return this.packagesList
    }
  }
})
