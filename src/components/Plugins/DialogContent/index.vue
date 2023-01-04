<!-- eslint-disable vue/valid-template-root -->
<template></template>
<script lang="ts" setup>
import { useDialog } from 'naive-ui'
//挂载在 window 方便与在js中使用
window['$dialog'] = useDialog()
</script>
