<!-- @/components/Document/Nav.vue -->
<template>
  <div class="sidebar-tree">
    <NavItem
      v-for="node in props.navigation"
      :key="node.slug"
      :node="node"
      :locale="props.locale"
      :module="props.module"
      :active-path="props.activePath"
      :base-path="`/${props.locale}/${props.module}`"
    />
  </div>
</template>

<script setup lang="ts">
import NavItem from './NavItem.vue';
import type { NavNode } from '@/types/doc';

const props = defineProps<{
  // Localized array
  navigation: NavNode[];
  locale: string;
  module: string;
  // currently selected physical path (e.g., 'formatter/using')
  activePath: string | null | undefined;
}>();
</script>

<style>
.sidebar-tree {
  padding: 10px 0;
  margin: 10px;

  .foldable-header {
    img {
      display: none;
    }
    p {
      font-size: 1.1rem;
    }
  }

  .foldable-content {
    padding-left: 16px;

    .nav-item {
      display: block;
      padding: 8px 10px;
    }
  }
}
</style>
