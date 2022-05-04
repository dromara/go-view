<template>
  <n-dropdown
    trigger="hover"
    @select="handleSelect"
    :show-arrow="true"
    :options="options"
  >
    <n-button quaternary>
      <n-icon size="20" :depth="1">
        <language-icon></language-icon>
      </n-icon>
    </n-button>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { useLangStore } from '@/store/modules/langStore/langStore'
import { langList } from '@/i18n/index'
import { LangEnum } from '@/enums/styleEnum'
import { icon } from '@/plugins'

const { LanguageIcon } = icon.ionicons5
const langStore = useLangStore()
const options = langList

const handleSelect = (key: LangEnum) => {
  langStore.changeLang(key)
}
</script>
