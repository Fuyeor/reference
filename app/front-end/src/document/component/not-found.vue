<!-- @/document/component/not-found.vue -->
<template>
  <HeaderBar />
  <StateDisplay
    type="not-found"
    :not-found-title="t('notFound.title')"
    :not-found-message="t('notFound.desc')"
    @action="router.push({ name: 'Home' })"
  />

  <div v-if="localeLinks.length > 0" class="locale-missing">
    <p>{{ t('doc.locale.unavailable') }}</p>
    <nav :aria-label="t('doc.locale.available')">
      <template v-for="(locale, index) in localeLinks" :key="locale.code">
        <router-link :to="locale.path">{{ locale.name }}</router-link>
        <span v-if="index < localeLinks.length - 1" aria-hidden="true">、</span>
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { t } from '@fuyeor/vue-locale';
import { useRouter } from '@fuyeor/vue-router';
import { HeaderBar, StateDisplay } from '@fuyeor/interactify';
import { getAvailableLocale, getLocaleName } from '@app/config/locales';

const props = defineProps<{
  module: string;
  navigation: string;
  availableLocales: string[];
}>();

const router = useRouter();

const localeLinks = computed(() =>
  getAvailableLocale(props.availableLocales).map((locale) => ({
    code: locale,
    name: getLocaleName(locale),
    path: `/${locale}/${props.module}/${props.navigation}`,
  })),
);
</script>

<style scoped>
.locale-missing {
  max-width: 42rem;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
  text-align: center;
  color: var(--text-secondary);
}

.locale-missing p {
  margin: 0 0 0.75rem;
}

.locale-missing nav {
  display: inline-flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.locale-missing a {
  color: var(--text-link);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
</style>
