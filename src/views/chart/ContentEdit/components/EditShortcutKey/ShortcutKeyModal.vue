<template>
  <n-modal
    v-model:show="modelShow"
    :mask-closable="true"
    @afterLeave="closeHandle"
  >
    <n-table class="model-content" :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>功能</th>
          <th>Win 快捷键</th>
          <th>
            <n-space justify="space-between">
              <span> Mac 快捷键 </span>
              <n-icon size="20" class="go-cursor-pointer" @click="closeHandle">
                <close-icon></close-icon>
              </n-icon>
            </n-space>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in shortcutKeyOptions" :key="index">
          <td>{{ item.label }}</td>
          <td>{{ item.win }}</td>
          <td>
            <n-gradient-text :size="22">{{
              item.mac.substr(0, 1)
            }}</n-gradient-text>
            + {{ item.mac.substr(3) }}
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-modal>
</template>

<script setup lang="ts">
import { icon } from '@/plugins'
import { WinKeyboard, MacKeyboard } from '@/enums/editPageEnum'

const { CloseIcon } = icon.ionicons5

const emit = defineEmits(['update:modelShow'])

defineProps({
  modelShow: Boolean,
})

// 快捷键
const shortcutKeyOptions = [
  {
    label: '向上移动',
    win: `${WinKeyboard.CTRL.toUpperCase()} + ↑ `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + ↑ `,
  },
  {
    label: '向右移动',
    win: `${WinKeyboard.CTRL.toUpperCase()} + → `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + → `,
  },
  {
    label: '向下移动',
    win: `${WinKeyboard.CTRL.toUpperCase()} + ↓ `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + ↓ `,
  },
  {
    label: '向左移动',
    win: `${WinKeyboard.CTRL.toUpperCase()} + ← `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + ← `,
  },
  {
    label: '删除',
    win: 'Delete'.toUpperCase(),
    mac: `${MacKeyboard.CTRL.toUpperCase()} + Backspace `,
  },
  {
    label: '复制',
    win: `${WinKeyboard.CTRL.toUpperCase()} + C `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + C `,
  },
  {
    label: '剪切',
    win: `${WinKeyboard.CTRL.toUpperCase()} + X `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + X `,
  },
  {
    label: '粘贴',
    win: `${WinKeyboard.CTRL.toUpperCase()} + V `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + V `,
  },
  {
    label: '后退',
    win: `${WinKeyboard.CTRL.toUpperCase()} + Z `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + Z `,
  },
  {
    label: '前进',
    win: `${WinKeyboard.CTRL.toUpperCase()} + ${WinKeyboard.SHIFT.toUpperCase()} + Z `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + ${MacKeyboard.SHIFT.toUpperCase()} + Z `,
  },
]
const closeHandle = () => {
  emit('update:modelShow', false)
}
</script>

<style lang="scss" scoped>
.model-content {
  width: 50vw;
  padding-bottom: 20px;
  overflow: hidden;
  border-radius: 15px;
  td {
    padding: 5px 10px;
  }
}
</style>