<!-- @/components/Document/DocMetaBar.vue -->
<template>
  <div class="fuyeor-doc-meta-bar">
    <!-- Contributors/Authors Section -->
    <span class="meta-item authors">
      <span class="meta-label">{{ t('doc.authors') }}: </span>
      <span class="meta-value">{{ props.meta.authors.join(', ') }}</span>
    </span>

    <span class="separator">/</span>

    <!-- Last Updated Date Section -->
    <span class="meta-item updated-at">
      <span class="meta-label">{{ t('updated.at') }}: </span>
      <span class="meta-value">
        {{ formatDate(meta.updatedAt, { preset: 'relative' }) }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useDateFormatter } from '@fuyeor/commons';
import { useLocale } from '@fuyeor/locale';
import type { DocMeta } from '@/types/doc';

const props = defineProps<{
  meta: DocMeta; // Article-level metadata (containing updatedAt and authors)
  locale: string; // Active locale (e.g. 'zh-hans')
}>();

const { t } = useLocale();
const { formatDate } = useDateFormatter();
</script>

<style scoped>
.fuyeor-doc-meta-bar {
  display: flex;
  font-size: 0.825rem;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.meta-label {
  font-weight: 500;
}
.meta-value {
  font-weight: 600;
}
</style>
