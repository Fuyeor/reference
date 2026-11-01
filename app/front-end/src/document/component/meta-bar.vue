<!-- @/document/component/meta-bar.vue -->
<template>
  <div class="fuyeor-doc-meta-bar">
    <!-- Contributors/Authors Section -->
    <span class="meta-item authors">
      <span class="meta-label">{{ t('doc.author') }}: </span>
      <span class="meta-value">{{ props.meta.author.join(', ') }}</span>
    </span>

    <span class="separator">/</span>

    <!-- Last Updated Date Section -->
    <span class="meta-item updated-at">
      <span class="meta-label">{{ t('updated') }}: </span>
      <span class="meta-value">
        {{ formatDate(meta.updated, { preset: 'relative' }) }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { t } from '@fuyeor/vue-locale';
import { useDateFormatter } from '@fuyeor/commons';
import type { LocalizedDocMeta } from '@/document/type';

const props = defineProps<{
  meta: LocalizedDocMeta; // Article-level metadata (containing updated and authors)
  locale: string; // Active locale (e.g. 'zh-hans')
}>();

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
