<template>
  <global-setting :optionData="optionData"></global-setting>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { GlobalSetting } from '@/components/Pages/ChartItemSetting'
import { option } from './config'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'

defineProps({
  optionData: {
    type: Object as PropType<typeof option & GlobalThemeJsonType>,
    required: true
  }
})
</script>
