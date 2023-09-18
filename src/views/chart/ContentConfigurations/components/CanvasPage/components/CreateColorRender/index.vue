<template>
  <div class="create-color-setting" v-if="editColor">
    <n-card :bordered="false" role="dialog" size="small" aria-modal="true">
      <n-space justify="space-between">
        <!-- 名称 -->
        <n-input-group>
          <n-input-group-label>名称:</n-input-group-label>
          <n-input
            class="create-color-name"
            v-model:value.trim="editColor.name"
            maxlength="8"
            show-count
            clearable
            @change="titleChangeHandle"
          />
        </n-input-group>
        <n-tag type="warning">底部图表仅展示 7 条数据</n-tag>
      </n-space>
      <!-- 颜色 -->
      <n-scrollbar style="max-height: 132px">
        <div class="color-list-box go-mt-3" :x-gap="12" :y-gap="12" :cols="4">
          <div class="color-list-item" v-for="(item, index) in editColor.color" :key="index">
            <div class="go-flex-items-center" :class="{ select: index === targetColor.index }">
              <n-color-picker
                style="width: 95px"
                v-model:value="editColor.color[index]"
                :show-preview="true"
                :modes="['hex']"
                @complete="completeHandle($event, index)"
                @update:show="selectHandle(item, index)"
              />
              <div v-show="index > 5">
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-icon class="go-ml-1 go-cursor-pointer" size="16" :depth="3" @click="deleteColor(index)">
                      <trash-icon></trash-icon>
                    </n-icon>
                  </template>
                  删除颜色
                </n-tooltip>
              </div>
            </div>
          </div>
          <div>
            <n-button type="primary" secondary @click="addColor">
              <div class="go-flex-items-center">
                <span class="go-mr-4">添加</span>
                <n-icon size="16">
                  <add-icon></add-icon>
                </n-icon>
              </div>
            </n-button>
          </div>
        </div>
      </n-scrollbar>
    </n-card>

    <!-- 扩展色 -->
    <div class="expend-color-box">
      <n-card class="go-mt-3 expend-color" :bordered="false" role="dialog" size="small" aria-modal="true">
        <n-text>默认扩展色：</n-text>
        <n-divider style="margin: 10px 0"></n-divider>
        <n-space :size="[4, 0]" justify="center">
          <div
            class="color-computed-item"
            v-for="(item, index) in expandColorList.default"
            :key="index"
            @click="selectExpandColor(item, false)"
          >
            <div class="n-color-picker-checkboard"></div>
            <div :style="getRenderBackgroundColor(item)"></div>
          </div>
        </n-space>
      </n-card>
      <n-card class="go-mt-3 expend-color" :bordered="false" role="dialog" size="small" aria-modal="true">
        <n-text>透明扩展色：</n-text>
        <n-divider style="margin: 10px 0"></n-divider>
        <n-space :size="[4, 0]" justify="center">
          <div
            class="color-computed-item"
            v-for="(item, index) in expandColorList.fade"
            :key="index"
            @click="selectExpandColor(item, true)"
          >
            <div class="n-color-picker-checkboard"></div>
            <div :style="getRenderBackgroundColor(item)"></div>
          </div>
        </n-space>
      </n-card>
    </div>

    <!-- 展示图表 -->
    <create-color-render-chart :color="cloneDeep(editColor.color).splice(0, 7)"></create-color-render-chart>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch, computed, reactive, nextTick } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { darken, lighten, fade, hslToHex, hslToHexa, loadAsyncComponent } from '@/utils'
import { icon } from '@/plugins'

type ColorType = {
  id: string
  name: string
  color: string[]
}

const props = defineProps({
  selectColor: Object as PropType<ColorType>
})

const emit = defineEmits(['updateColor'])

const { AddIcon, TrashIcon } = icon.ionicons5
const CreateColorRenderChart = loadAsyncComponent(() => import('../CreateColorRenderChart/index.vue'))

// 拷贝的一份数据
const editColor = ref<ColorType | undefined>()
// 目标颜色
const targetColor = reactive<{
  index: number
  color?: string
}>({
  // -1 表示无选中元素
  index: -1,
  color: ''
})

// 监听值
watch(
  () => props.selectColor?.id,
  () => {
    editColor.value = cloneDeep(props.selectColor)
    targetColor.index = 0
    targetColor.color = editColor.value?.color[0]
  },
  {
    immediate: true,
    deep: false
  }
)

// 扩展色
const expandColorList = computed(() => {
  return computedColorList(targetColor.color)
})

// 计算背景色
const computedColorList = (color?: string) => {
  if (!color)
    return {
      default: [],
      fade: []
    }
  const num: number = 36
  const comDarkenArr: string[] = []
  const comLightenArr: string[] = []
  const comDarkenFadeArr: string[] = []

  for (let i = 0; i < num; i++) {
    comLightenArr.unshift(lighten(color, (1 / 100) * (i + 1)))
    comDarkenArr.push(darken(color, (3.5 / 100) * (i + 1)))
  }

  // 透明
  comDarkenArr.forEach((item, i) => {
    comDarkenFadeArr.unshift(fade(item, (1 / 100) * (i + 1)))
  })

  return {
    default: [
      ...comLightenArr.reverse().splice(0, parseInt(`${num / 2}`) - 9),
      ...comDarkenArr.splice(0, parseInt(`${num / 2}`))
    ],
    fade: comDarkenFadeArr.reverse().splice(0, 27)
  }
}

// 渲染背景色
const getRenderBackgroundColor = (color?: string) => {
  return {
    backgroundColor: color
  }
}

// 点击颜色
const selectHandle = (color: string, index: number) => {
  targetColor.color = color
  targetColor.index = index
}

// 顶部改变颜色
const completeHandle = (color?: string, index?: number) => {
  color && (targetColor.color = color)
  index && (targetColor.index = index)
  nextTick(() => {
    emit('updateColor', editColor.value)
  })
}

// 选择扩展色
const selectExpandColor = (color: string, isHexa: boolean) => {
  const hexColor = isHexa ? hslToHexa(color) : hslToHex(color)
  editColor.value && (editColor.value.color[targetColor.index] = hexColor)
  nextTick(() => {
    emit('updateColor', editColor.value)
  })
}

// 新增颜色
const addColor = () => {
  const lastData = editColor.value?.color[editColor.value?.color.length - 1] || '#2c2c31'
  editColor.value?.color.push(lastData)
  nextTick(() => {
    emit('updateColor', editColor.value)
  })
}

// 删除颜色
const deleteColor = (index: number) => {
  editColor.value?.color.splice(index, 1)
  if (index === targetColor.index) {
    completeHandle(editColor.value?.color[index - 1], index - 1)
  }
}

// 修改名称
const titleChangeHandle = () => {
  nextTick(() => {
    emit('updateColor', editColor.value)
  })
}
</script>

<style scoped lang="scss">
.create-color-setting {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-right: 10px;
  .create-color-name {
    width: 200px;
  }
  .color-list-box {
    display: flex;
    flex-wrap: wrap;
    row-gap: 8px;
    .color-list-item {
      width: calc(100% / 4);
      .select {
        .n-color-picker {
          border: 2px solid v-bind('targetColor.color');
          border-radius: 5px;
        }
      }
    }
  }
  .expend-color-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .expend-color {
      width: calc(50% - 5px);
      .color-computed-item {
        position: relative;
        display: inline-block;
        height: 22px;
        width: 22px;
        cursor: pointer;
        overflow: hidden;
        border-radius: 4px;
        & div {
          position: absolute;
          display: inline-block;
          height: 22px;
          width: 22px;
        }
      }
    }
  }
}
</style>
