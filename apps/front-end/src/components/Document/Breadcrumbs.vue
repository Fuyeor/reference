<!-- @/components/Document/Breadcrumbs.vue -->
<template>
  <nav class="fuyeor-breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li
        v-for="(item, index) in items"
        :key="item.path"
        class="breadcrumb-item"
      >
        <router-link :to="item.path">{{ item.title }}</router-link>
        <span v-if="index < items.length - 1" class="separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from '@fuyeor/locale';
import { useJsonLd } from '@fuyeor/commons';
import type { ModuleStructure, NavNode } from '@/types/doc';

interface BreadcrumbItem {
  title: string;
  path: string;
}

const props = defineProps<{
  structure: ModuleStructure;
  locale: string;
  module: string;
  navigation: string;
}>();

const { t } = useLocale();

const items = computed<BreadcrumbItem[]>(() => {
  const locale = props.locale;

  // home
  const list: BreadcrumbItem[] = [{ title: t('home'), path: `/${locale}` }];

  // module
  const modulePath = `/${locale}/${props.module}`;
  list.push({
    title: props.structure.title,
    path: modulePath,
  });

  // navigation
  if (props.navigation) {
    const segments = props.navigation.split('/');
    // discard the last segment (leaf node) for breadcrumbs, only show parent directories
    const parentSegments = segments.slice(0, -1);

    let currentNavLevel = props.structure.navigation || [];
    let accumulatedPath = modulePath;

    for (const seg of parentSegments) {
      accumulatedPath += `/${seg}`;

      // find the corresponding child directory in the current outline level
      const matchNode = currentNavLevel.find(
        (node: NavNode) => node.slug === seg,
      );

      if (matchNode) {
        list.push({
          title: matchNode.title,
          path: accumulatedPath,
        });

        currentNavLevel = matchNode.navigation || [];
      } else {
        list.push({
          title: seg,
          path: accumulatedPath,
        });
      }
    }
  }

  return list;
});

// https://search.google.com/test/rich-results
useJsonLd(() => {
  if (!items.value.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.value.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      item: `https://reference.fuyeor.com${item.path}`,
    })),
  };
});
</script>

<style scoped>
.fuyeor-breadcrumbs {
  margin-bottom: 2rem;
}
.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
}
.breadcrumb-item {
  display: flex;
  align-items: center;
}
.breadcrumb-item a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s ease;
}
.breadcrumb-item a:hover {
  color: #3b10b9;
  text-decoration: underline;
}
.breadcrumb-item:last-child a {
  color: #111;
  pointer-events: none;
}
.separator {
  margin: 0 0.5rem;
  color: #ccc;
  user-select: none;
}
</style>
