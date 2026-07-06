<!-- @/components/Document/Nav.vue -->
<template>
  <div class="sidebar-tree">
    <template v-for="node in props.navigation" :key="node.slug">
      <!-- Case A: page like /overview -->
      <router-link
        v-if="!node.navigation"
        :to="`/${props.locale}/${props.module}/${node.slug}`"
        class="nav-item"
        active-class="active"
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
        <div class="foldable-children">
          <router-link
            v-for="subNode in node.navigation"
            :key="subNode.slug"
            :to="`/${props.locale}/${props.module}/${node.slug}/${subNode.slug}`"
            class="nav-item sub-item"
            active-class="active"
          >
            {{ subNode.title }}
          </router-link>
        </div>
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
