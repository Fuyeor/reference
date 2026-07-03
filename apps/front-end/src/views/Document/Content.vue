<!-- @/views/Document/View.vue -->
<template>
  <HeaderBar title="REFERENCE" />

  <StateDisplay
    v-if="!isRetrieved"
    :type="status"
    :not-found-title="t('content.notFound')"
    :not-found-message="t('content.notFound.desc')"
    @action="router.push({ name: 'Home' })"
  />

  <div v-else class="content-layout">
    <Breadcrumbs
      v-if="structure.isRetrieved.value"
      :structure="structure.data.value!"
      :locale="currentLocale"
      :module="currentModule"
      :navigation="currentNavigation"
    />

    <MarkdownRenderer :content="content" />
  </div>
</template>

<script setup lang="ts">
import Breadcrumbs from '@/components/Document/Breadcrumbs.vue';

import { computed } from 'vue';
import { useRoute, useRouter } from '@fuyeor/vue-router';
import { useLocale } from '@fuyeor/locale';
import { HeaderBar, StateDisplay } from '@fuyeor/interactify';
import { MarkdownRenderer } from '@/composables/loader/useMarkdownComponents';
import { useModuleStructure, useDocMarkdown } from '@/composables/api/useDoc';

const { t } = useLocale();

const route = useRoute();
const router = useRouter();

const currentLocale = computed(() => route.params.locale);
const currentModule = computed(() => route.params.module);
const currentNavigation = computed(() => route.params.navigation);

const structure = useModuleStructure(
  () => currentModule.value,
  () => currentLocale.value,
);

const {
  data: content,
  status,
  isRetrieved,
} = useDocMarkdown(
  () => currentModule.value,
  () => currentNavigation.value,
  () => currentLocale.value,
);
</script>

<style scoped></style>
