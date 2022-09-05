<template>
  <n-config-provider
    :locale="zhCN"
    :theme="darkTheme"
    :hljs="hljsTheme"
    :date-locale="dateZhCN"
    :theme-overrides="overridesTheme"
  >
    <go-app-provider>
      <I18n></I18n>
      <router-view></router-view>
    </go-app-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { zhCN, dateZhCN, NConfigProvider } from 'naive-ui'
import { GoAppProvider } from '@/components/GoAppProvider'
import { I18n } from '@/components/I18n'

import { useDarkThemeHook, useThemeOverridesHook, useCode } from '@/hooks'

// 暗黑主题
const darkTheme = useDarkThemeHook()

// 主题配置
const overridesTheme = useThemeOverridesHook()

// 代码主题
const hljsTheme = useCode()
</script>
