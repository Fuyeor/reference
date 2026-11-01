<!-- @/App.vue -->
<template>
  <left-sidebar />

  <main>
    <router-view />
  </main>

  <!-- 根据是否为移动端来条件渲染右侧边栏 -->
  <right-sidebar v-if="showRightSidebar" />

  <back-top />

  <!-- toast notifications -->
  <toast-provider position="bottom-right" />
</template>

<script setup lang="ts">
import LeftSidebar from '@app/component/left.vue';

import { computed } from 'vue';
import { useRoute } from '@fuyeor/vue-router';
import { useHeadManager } from '@fuyeor/commons';
import {
  isMobile,
  useFontLoader,
  BackTop,
  ToastProvider,
} from '@fuyeor/interactify';
import { useAsyncComponents } from '@app/composables/loader/useAsyncComponents';

const route = useRoute();
const showRightSidebar = computed(
  () => !isMobile.value && route.name !== 'Module',
);

// get all async components
const { RightSidebar } = useAsyncComponents();

// 启用字体加载
useFontLoader();
// 启动全局标题管理器
useHeadManager({
  nameKey: 'site.name',
  titleKey: 'site.title',
});
</script>
