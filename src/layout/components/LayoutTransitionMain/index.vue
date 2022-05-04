<template>
  <router-view #default="{ Component, route }">
    <transition name="fade" mode="out-in" appear>
      <component
        v-if="route.noKeepAlive"
        :is="Component"
        :key="route.fullPath"
      ></component>
      <keep-alive v-else>
        <component :is="Component" :key="route.fullPath"></component>
      </keep-alive>
    </transition>
  </router-view>
</template>
