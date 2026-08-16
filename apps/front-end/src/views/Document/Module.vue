// @/views/Document/Module.vue
<template>
  <StateDisplay
    v-if="!isRetrieved"
    :type="status"
    :not-found-title="t('content.notFound')"
    :not-found-message="t('content.notFound.desc')"
    @action="router.push({ name: 'Home' })"
  />

  <div v-else-if="moduleStructure" class="module-directory">
    <header class="module-header">
      <p class="module-eyebrow">{{ t('module.directory') }}</p>
      <h1>{{ moduleStructure.title }}</h1>
      <p class="module-description">{{ moduleStructure.description }}</p>
    </header>

    <MasonryGrid
      :items="directorySections"
      :column-width="180"
      :gap="24"
      :mobile-columns="1"
    >
      <template #default="{ item }">
        <section class="directory-section">
          <h2>{{ item.title }}</h2>
          <ul class="directory-list">
            <ModuleDirectoryItem
              v-for="node in item.nodes"
              :key="node.slug"
              :node="node"
              :base-path="
                item.id === 'overview'
                  ? basePath
                  : `${basePath}/${item.id}`
              "
            />
          </ul>
        </section>
      </template>
    </MasonryGrid>
  </div>

  <LeftAnchor>
    <DocNav
      v-if="isRetrieved && moduleStructure"
      :navigation="moduleStructure.navigation"
      :locale="contentLocale"
      :module="currentModule"
      :active-path="null"
    />
  </LeftAnchor>
</template>

<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from '@fuyeor/vue-router';
import { useLocale } from '@fuyeor/locale';
import { useTitleStore } from '@fuyeor/commons';
import { MasonryGrid, StateDisplay } from '@fuyeor/interactify';
import LeftAnchor from '@/components/LeftAnchor.vue';
import DocNav from '@/components/Document/Nav.vue';
import ModuleDirectoryItem from '@/components/Document/ModuleDirectoryItem.vue';
import { useModuleStructure } from '@/composables/api/useDoc';
import { buildModuleDirectorySections } from '@/utils/module-directory';

const route = useRoute();
const router = useRouter();
const { t } = useLocale();
const titleStore = useTitleStore();

const currentLocale = computed(() => String(route.params.locale));
const contentLocale = computed(() =>
  currentLocale.value === 'zh-hant' ? 'zh-hans' : currentLocale.value,
);
const currentModule = computed(() => String(route.params.module));
const basePath = computed(
  () => `/${currentLocale.value}/${currentModule.value}`,
);

const {
  data: moduleStructure,
  status,
  isRetrieved,
} = useModuleStructure(
  () => currentModule.value,
  () => contentLocale.value,
);

const directorySections = computed(() =>
  moduleStructure.value
    ? buildModuleDirectorySections(
        moduleStructure.value.navigation,
        t('module.overview'),
      )
    : [],
);

watch(
  [moduleStructure, isRetrieved],
  ([structure, retrieved]) => {
    if (retrieved && structure) titleStore.setDynamicSegment(structure.title);
  },
  { immediate: true },
);

onUnmounted(() => titleStore.clearDynamicSegment());
</script>

<style>
.module-directory {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;
}

.module-header {
  max-width: 760px;
  margin-bottom: 2.5rem;

  h1 {
    margin: 0.5rem 0 1rem;
    color: var(--text-primary);
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.15;
  }
}

.module-eyebrow {
  margin: 0;
  color: var(--text-accent);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.module-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.12rem;
  line-height: 1.65;
}

.directory-section {
  box-sizing: border-box;
  padding: 1.35rem 1.5rem 1.5rem;
  border: var(--border-default);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  box-shadow: var(--shadow-sm, 0 8px 24px rgb(0 0 0 / 4%));

  h2 {
    margin: 0 0 1rem;
    color: var(--text-primary);
    font-size: 1.18rem;
    line-height: 1.35;
  }
}

.directory-list {
  margin: 0;
  padding: 0;
}

@media (width <= 768px) {
  .module-directory {
    padding: 2rem 1rem 4rem;
  }
}
</style>
