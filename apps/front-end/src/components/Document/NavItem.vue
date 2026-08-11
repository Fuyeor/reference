<!-- @/components/Document/NavItem.vue -->
<template>
  <!-- Case A: page like /overview -->
  <router-link
    v-if="!node.navigation || node.navigation.length === 0"
    class="nav-item"
    :to="fullPath"
  >
    {{ titleText }}
  </router-link>

  <!-- Case B: folder like /getting-started/ -->
  <Foldable v-else :title="titleText" :model-value="isFolderActive">
    <!-- recursively render its self -->
    <NavItem
      v-for="subNode in node.navigation"
      :key="subNode.slug"
      :node="subNode"
      :locale="locale"
      :module="module"
      :active-path="activePath"
      :base-path="fullPath"
    />
  </Foldable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Foldable } from '@fuyeor/interactify';
import type { NavNode } from '@/types/doc';

const props = defineProps<{
  node: NavNode;
  locale: string;
  module: string;
  activePath: string | null | undefined;
  basePath: string; // parent URL path
}>();

// Automatically increment the path: e.g., /en/doc/getting-started/installation
const fullPath = computed(() => `${props.basePath}/${props.node.slug}`);

// Multilingual title string or object
const titleText = computed(() => {
  if (typeof props.node.title === 'string') return props.node.title;
  return props.node.title[props.locale] || props.node.slug;
});

// Highlighting and expansion:
// Check if the currently active path contains the slug of this folder
const isFolderActive = computed(() => {
  if (!props.activePath) return false;
  const segments = props.activePath.split('/');
  return segments.includes(props.node.slug);
});
</script>
