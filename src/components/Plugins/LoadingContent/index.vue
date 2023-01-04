<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script lang="ts" setup>
import { useLoadingBar } from 'naive-ui'
// 挂载在 window 方便与在js中使用
window['$loading'] = useLoadingBar()
window['$loading'].finish()
</script>
