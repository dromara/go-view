<template>
  <router-view>
    <template #default="{ Component, route }">
      <component
        v-if="route.noKeepAlive"
        :is="Component"
        :key="route.fullPath"
      ></component>
      <keep-alive v-else>
        <component :is="Component" :key="route.fullPath"></component>
      </keep-alive>
    </template>
  </router-view>
</template>
