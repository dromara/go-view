<template>
  <img class="list-img" v-lazy="imageInfo" alt="图表图片" />
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue'
import { fetchImages } from '@/packages'
import { ConfigType } from '@/packages/index.d'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<ConfigType>,
    required: true
  },
})

const imageInfo = ref('')

// 获取图片
const fetchImageUrl = async () => {
  imageInfo.value = await fetchImages(props.chartConfig)
}
fetchImageUrl()
</script>
