<!-- @/App.vue -->
<template>
  <left-sidebar />

  <main>
    <router-view />
  </main>

  <!-- 根据是否为移动端来条件渲染右侧边栏 -->
  <right-sidebar v-if="!isMobile" />

  <back-top />

  <!-- toast notifications -->
  <toast-provider position="bottom-right" />
</template>

<script setup lang="ts">
import LeftSidebar from '@/layout/Left.vue';

import { computed } from 'vue';
import { useHeadManager } from '@fuyeor/commons';
import {
  useFontLoader,
  useMobileDetection,
  BackTop,
  ToastProvider,
} from '@fuyeor/interactify';
import { useAsyncComponents } from '@/composables/loader/useAsyncComponents';

const { isMobile } = useMobileDetection();

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
