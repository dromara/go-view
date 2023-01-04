<template>
  <!-- 全局配置 -->
  <n-card class="n-card-shallow">
    <n-tag type="info" :bordered="false" style="border-radius: 5px"> 全局公共配置 </n-tag>
    <setting-item-box
      name="服务"
      :itemRightStyle="{
        gridTemplateColumns: '5fr 2fr 1fr'
      }"
    >
      <!-- 源地址 -->
      <setting-item name="前置 URL">
        <n-input v-model:value.trim="requestOriginUrl" :disabled="editDisabled" placeholder="例：http://127.0.0.1/"></n-input>
      </setting-item>
      <setting-item name="更新间隔，为 0 只会初始化">
        <n-input-group>
          <n-input-number
            class="select-time-number"
            v-model:value.trim="requestInterval"
            min="0"
            :show-button="false"
            :disabled="editDisabled"
            placeholder="请输入数字"
          >
          </n-input-number>
          <!-- 单位 -->
          <n-select
            class="select-time-options"
            v-model:value="requestIntervalUnit"
            :options="selectTimeOptions"
            :disabled="editDisabled"
          />
        </n-input-group>
      </setting-item>
      <n-button v-show="editDisabled" type="primary" ghost @click="editDisabled = false">
        <template #icon>
          <n-icon>
            <pencil-icon />
          </n-icon>
        </template>
        编辑配置
      </n-button>
    </setting-item-box>
    <!-- table 内容体 -->
    <n-collapse-transition :show="showTable">
      <request-global-header-table :editDisabled="editDisabled"></request-global-header-table>
    </n-collapse-transition>
    <!-- 箭头 -->
    <div v-if="showTable" class="go-flex-center go-mt-3 down" @click="showTable = false">
      <n-icon size="32">
        <chevron-up-outline-icon />
      </n-icon>
    </div>
    <div v-else class="go-flex-center go-mt-3 down" @click="showTable = true">
      <n-tooltip trigger="hover" placement="top" :keep-alive-on-hover="false">
        <template #trigger>
          <n-icon size="32">
            <chevron-down-outline-icon />
          </n-icon>
        </template>
        展开
      </n-tooltip>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, toRefs, computed } from 'vue'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { useTargetData } from '@/views/chart/ContentConfigurations/components/hooks/useTargetData.hook'
import { selectTypeOptions, selectTimeOptions } from '@/views/chart/ContentConfigurations/components/ChartData/index.d'
import { RequestGlobalHeaderTable } from '../RequestGlobalHeaderTable'
import { icon } from '@/plugins'

const { PencilIcon, ChevronDownOutlineIcon, ChevronUpOutlineIcon } = icon.ionicons5
const { chartEditStore } = useTargetData()
const { requestOriginUrl, requestInterval, requestIntervalUnit } = toRefs(chartEditStore.getRequestGlobalConfig)
const editDisabled = ref(true)

const designStore = useDesignStore()

const showTable = ref(false)
// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})
</script>

<style lang="scss" scoped>
.n-card-shallow {
  &:hover {
    border-color: v-bind('themeColor');
  }
}
.down {
  cursor: pointer;
  &:hover {
    color: v-bind('themeColor');
  }
}
.select-time-number {
  width: 100%;
}
.select-time-options {
  width: 100px;
}
</style>
