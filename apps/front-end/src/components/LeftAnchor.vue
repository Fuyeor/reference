<!-- @/components/LeftAnchor.vue -->
<template>
  <!-- 始终传送，因为左侧边栏在移动端和桌面端逻辑一致 -->
  <Teleport to="#left-sidebar-anchor">
    <slot />
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useLayoutStore } from '@/stores/layout';

const layoutStore = useLayoutStore();

onMounted(() => layoutStore.add());

onUnmounted(() => layoutStore.del());
</script>
