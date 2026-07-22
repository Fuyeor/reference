<!-- @/views/Document/Content.vue -->
<template>
  <HeaderBar
    v-if="isDocMetaRetrieved"
    :hide-when-no-history="false"
    :title="docMeta!.title"
  >
    <template #actions>
      <LocaleMenu :locales="docMeta!.locale" />

      <DocActionMenu
        :content="content!"
        :locale="currentLocale"
        :module="currentModule"
        :navigation="currentNavigation"
      />
    </template>
  </HeaderBar>

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

    <MarkdownRenderer :content="content" @toc-updated="handleTocUpdated" />

    <LayoutAnchor display="desktop">
      <MarkdownToc
        v-if="tocItems.length > 0"
        :items="tocItems"
        :title="t('doc.toc')"
      />
    </LayoutAnchor>

    <div class="doc-meta-container">
      <PrevNext :prev="prevNextPages.prev" :next="prevNextPages.next" />

      <DocMetaBar
        v-if="isDocMetaRetrieved"
        :meta="docMeta!"
        :locale="currentLocale"
      />
    </div>
  </div>

  <LeftAnchor>
    <DocNav
      v-if="structure.isRetrieved.value"
      :navigation="structure.data.value!.navigation"
      :locale="currentLocale"
      :module="currentModule"
      :active-path="currentNavigation"
    />
  </LeftAnchor>
</template>

<script setup lang="ts">
import LocaleMenu from '@/components/Document/LocaleMenu.vue';
import DocActionMenu from '@/components/Document/DocActionMenu.vue';
import Breadcrumbs from '@/components/Document/Breadcrumbs.vue';
import DocMetaBar from '@/components/Document/DocMetaBar.vue';
import PrevNext from '@/components/Document/PrevNext.vue';
import LeftAnchor from '@/components/LeftAnchor.vue';
import DocNav from '@/components/Document/Nav.vue';

import { ref, computed, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from '@fuyeor/vue-router';
import { useLocale } from '@fuyeor/locale';
import { useTitleStore } from '@fuyeor/commons';
import {
  HeaderBar,
  StateDisplay,
  LayoutAnchor,
  MarkdownToc,
  type TocItem,
} from '@fuyeor/interactify';
import { MarkdownRenderer } from '@/composables/loader/useMarkdownComponents';
import {
  useModuleStructure,
  useDocMarkdown,
  useDocMeta,
} from '@/composables/api/useDoc';
import { flattenNavNodes } from '@/utils/tree';

const { t } = useLocale();

const route = useRoute();
const router = useRouter();
const titleStore = useTitleStore();
const tocItems = ref<TocItem[]>([]);

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

const { data: docMeta, isRetrieved: isDocMetaRetrieved } = useDocMeta(
  () => currentModule.value,
  () => currentNavigation.value,
);

const handleTocUpdated = (items: TocItem[]) => {
  tocItems.value = items;
};

// set page title
watch(
  () => isDocMetaRetrieved.value && structure.isRetrieved.value,
  (ready) => {
    if (ready && docMeta.value && structure.data.value) {
      const pageTitle = docMeta.value.title;
      const locale = currentLocale.value;

      // extract module localized title
      const moduleTitle =
        typeof structure.data.value.title === 'string'
          ? structure.data.value.title
          : structure.data.value.title[locale] || currentModule.value;

      // article title « module
      titleStore.setDynamicSegment(`${pageTitle} « ${moduleTitle}`);
    }
  },
  { immediate: true },
);

// clean title
onUnmounted(() => {
  titleStore.clearDynamicSegment();
});

const prevNextPages = computed(() => {
  if (
    !structure.isRetrieved.value ||
    !structure.data.value ||
    !currentNavigation.value
  ) {
    return { prev: null, next: null };
  }

  const locale = currentLocale.value;
  const book = currentModule.value;
  const currentContentPath = currentNavigation.value;

  // Flatten the leaf nodes of the entire book
  const flatPages = flattenNavNodes(
    structure.data.value.navigation,
    '',
    locale,
  );

  // Retrieve the physical location of the current page
  const activeIndex = flatPages.findIndex(
    (p) => p.slugPath === currentContentPath,
  );

  if (activeIndex === -1) {
    return { prev: null, next: null };
  }

  const prevNode = activeIndex > 0 ? flatPages[activeIndex - 1] : null;
  const nextNode =
    activeIndex < flatPages.length - 1 ? flatPages[activeIndex + 1] : null;

  const baseRoute = `/${locale}/${book}`;

  return {
    prev: prevNode
      ? { title: prevNode.title, path: `${baseRoute}/${prevNode.slugPath}` }
      : null,
    next: nextNode
      ? { title: nextNode.title, path: `${baseRoute}/${nextNode.slugPath}` }
      : null,
  };
});
</script>

<style>
.doc-meta-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 3.5rem;
  border-top: var(--border-subtle);
  padding-top: 2rem;
}
</style>
