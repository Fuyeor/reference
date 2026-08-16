// @/components/Document/ModuleDirectoryItem.vue
<template>
  <li v-if="hasChildren" class="directory-item directory-group">
    <h4>{{ node.title }}</h4>
    <ul>
      <ModuleDirectoryItem
        v-for="child in node.navigation"
        :key="child.slug"
        :node="child"
        :base-path="fullPath"
      />
    </ul>
  </li>

  <li v-else class="directory-item">
    <router-link :to="fullPath">{{ node.title }}</router-link>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { NavNode } from '@/types/doc';

const props = defineProps<{
  node: NavNode;
  basePath: string;
}>();

const hasChildren = computed(
  () => Boolean(props.node.navigation && props.node.navigation.length > 0),
);
const fullPath = computed(() => `${props.basePath}/${props.node.slug}`);
</script>

<style scoped>
.directory-item {
  list-style: none;

  a {
    display: block;
    padding: 0.38rem 0;
    color: var(--text-secondary);
    text-decoration: none;
    line-height: 1.45;

    &:hover {
      color: var(--text-accent);
    }
  }
}

.directory-group {
  margin-top: 0.8rem;

  &:first-child {
    margin-top: 0;
  }

  h4 {
    margin: 0 0 0.25rem;
    color: var(--text-primary);
    font-size: 0.95rem;
    font-weight: 600;
  }

  ul {
    margin: 0;
    padding: 0;
  }
}
</style>
