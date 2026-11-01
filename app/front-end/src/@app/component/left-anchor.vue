<!-- @app/component/left-anchor.vue -->
<template>
  <!-- 始终传送，因为左侧边栏在移动端和桌面端逻辑一致 -->
  <Teleport to="#left-sidebar-anchor">
    <slot />
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useLayoutState } from '@app/state/layout';

const layoutState = useLayoutState();

onMounted(() => layoutState.add());

onUnmounted(() => layoutState.del());
</script>
