<!-- @/components/Document/Nav.vue -->
<template>
  <div class="sidebar-tree">
    <template v-for="node in props.navigation" :key="node.slug">
      <!-- Case A: page like /overview -->
      <router-link
        v-if="!node.navigation"
        class="nav-item"
        :to="`/${props.locale}/${props.module}/${node.slug}`"
      >
        {{ node.title }}
      </router-link>

      <!-- Case B: folder like /getting-started/ -->
      <Foldable
        v-else
        :title="
          typeof node.title === 'string' ? node.title : node.title[props.locale]
        "
        :model-value="isFolderActive(node.slug)"
      >
        <router-link
          v-for="subNode in node.navigation"
          class="nav-item sub-item"
          :key="subNode.slug"
          :to="`/${props.locale}/${props.module}/${node.slug}/${subNode.slug}`"
        >
          {{ subNode.title }}
        </router-link>
      </Foldable>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Foldable } from '@fuyeor/interactify';
import type { NavNode } from '@/types/doc';

const props = defineProps<{
  // Localized array
  navigation: NavNode[];
  locale: string;
  module: string;
  // currently selected physical path (e.g., 'formatter/using')
  activePath: string | null | undefined;
}>();

const isFolderActive = (folderSlug: string) => {
  if (!props.activePath) return false;
  const segments = props.activePath.split('/');
  return segments.includes(folderSlug);
};
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
      padding: 8px 10px;
    }
  }
}
</style>
