<!-- @/views/Document/Content.vue -->
<template>
  <HeaderBar
    v-if="isDocMetaRetrieved && !showDocumentNotFound"
    :hide-when-no-history="false"
    :title="currentMeta?.title || '...'"
  >
    <template #actions>
      <LocaleMenu :locales="availableLocales" />

      <DocActionMenu
        :content="content!"
        :locale="contentLocale"
        :module="currentModule"
        :navigation="currentNavigation"
      />
    </template>
  </HeaderBar>

  <DocumentNotFound
    v-if="showDocumentNotFound"
    :module="currentModule"
    :navigation="currentNavigation"
    :available-locales="availableLocales"
  />

  <StateDisplay
    v-else-if="!isRetrieved"
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

      <RecentlyRead />
    </LayoutAnchor>

    <div class="doc-meta-container">
      <PrevNext :prev="prevNextPages.prev" :next="prevNextPages.next" />

      <DocMetaBar
        v-if="isDocMetaRetrieved"
        :meta="currentMeta!"
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
import DocumentNotFound from '@/components/Document/DocumentNotFound.vue';
import DocActionMenu from '@/components/Document/DocActionMenu.vue';
import Breadcrumbs from '@/components/Document/Breadcrumbs.vue';
import DocMetaBar from '@/components/Document/DocMetaBar.vue';
import PrevNext from '@/components/Document/PrevNext.vue';
import LeftAnchor from '@/components/LeftAnchor.vue';
import DocNav from '@/components/Document/Nav.vue';
import RecentlyRead from '@/components/Document/RecentlyRead.vue';

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
import { useRecentlyRead } from '@/composables/useRecentlyRead';
import { flattenNavNodes } from '@/utils/tree';
import { resolveDocumentState } from '@/utils/document-state';
import { getAvailableLocales, getContentLocale } from '@/config/locales';

const { t } = useLocale();
const { addHistory } = useRecentlyRead();

const route = useRoute();
const router = useRouter();
const titleStore = useTitleStore();
const tocItems = ref<TocItem[]>([]);

const currentLocale = computed(() => String(route.params.locale));
const contentLocale = computed(() => getContentLocale(currentLocale.value));
const currentModule = computed(() => String(route.params.module));
const currentNavigation = computed(() => String(route.params.navigation));

const structure = useModuleStructure(
  () => currentModule.value,
  () => contentLocale.value,
);

const {
  data: content,
  status,
  isRetrieved,
} = useDocMarkdown(
  () => currentModule.value,
  () => currentNavigation.value,
  () => contentLocale.value,
);

const {
  data: docMeta,
  isRetrieved: isDocMetaRetrieved,
  isNotFound: isDocMetaNotFound,
} = useDocMeta(
  () => currentModule.value,
  () => currentNavigation.value,
);

const handleTocUpdated = (items: TocItem[]) => {
  tocItems.value = items;
};

// get LocalizedDocMeta for current language
const currentMeta = computed(() => {
  if (!isDocMetaRetrieved.value || !docMeta.value) return null;
  const locale = contentLocale.value;
  return docMeta.value[locale] || Object.values(docMeta.value)[0];
});

const availableLocales = computed<string[]>(() =>
  getAvailableLocales(docMeta.value ? Object.keys(docMeta.value) : []),
);

const documentState = computed(() =>
  resolveDocumentState({
    meta: docMeta.value,
    locale: contentLocale.value,
    isRetrieved: isDocMetaRetrieved.value,
    isNotFound: isDocMetaNotFound.value,
  }),
);

const showDocumentNotFound = computed(() => {
  return (
    documentState.value === 'not-found' ||
    documentState.value === 'locale-missing'
  );
});

// set page title
watch(
  [currentMeta, () => structure.isRetrieved.value, documentState],
  ([meta, structureReady, pageState]) => {
    if (
      pageState === 'available' &&
      meta &&
      structureReady &&
      structure.data.value
    ) {
      const pageTitle = meta.title;
      const moduleTitle = structure.data.value.title;

      // article title « module
      titleStore.setDynamicSegment(`${pageTitle} « ${moduleTitle}`);

      const fullPath = `/${currentLocale.value}/${currentModule.value}/${currentNavigation.value}`;
      addHistory(pageTitle, fullPath);
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
