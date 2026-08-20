<!-- @/views/Home.vue -->
<template>
  <locale-switcher
    :supported-locales="SUPPORTED_LOCALES"
    @change="handleLocaleChange"
  />

  <div class="home-page">
    <section class="hero">
      <p class="eyebrow">{{ t('intro.eyebrow') }}</p>
      <h1 v-html="t('intro.title')"></h1>
      <p>{{ t('intro.desc') }}</p>

      <SearchBar />
    </section>

    <section class="module-section" aria-labelledby="module-section-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ t('module.directory') }}</p>
          <h2 id="module-section-title">{{ t('module.all') }}</h2>
        </div>
        <span v-if="moduleCards.length" class="module-count">
          {{ moduleCards.length }}
        </span>
      </div>

      <div v-if="moduleCards.length" class="module-grid">
        <router-link
          v-for="module in moduleCards"
          :key="module.module"
          class="module-card"
          :to="`/${currentLocale}/${module.module}`"
        >
          <span class="module-card-title">{{ module.title }}</span>
          <span class="module-card-description">{{ module.description }}</span>
          <span class="module-card-action">{{ t('module.explore') }}</span>
        </router-link>
      </div>

      <p v-else class="module-empty">{{ t('module.empty') }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from '@fuyeor/vue-router';
import { useLocale } from '@fuyeor/locale';
import { LocaleSwitcher, SearchBar } from '@fuyeor/interactify';
import { getContentLocale, SUPPORTED_LOCALES } from '@/config/locales';
import { useModuleIndex } from '@/composables/api/useDoc';

const route = useRoute();
const router = useRouter();

const { t } = useLocale();
const currentLocale = computed(() => String(route.params.locale));
const contentLocale = computed(() => getContentLocale(currentLocale.value));
const { data: moduleIndex } = useModuleIndex(() => contentLocale.value);
const moduleCards = computed(() => moduleIndex.value ?? []);

// 处理语言切换带来的路由变更
const handleLocaleChange = (newLocale: string) => {
  // 使用 replace 替换当前的 locale 参数
  router.replace({
    name: route.name,
    // 路由会自动生成 /ja/signin
    params: { locale: newLocale },
  });
};
</script>

<style>
html:lang(zh-hans),
html:lang(zh-hant),
html:lang(ja) {
  .hero {
    h1 {
      font-size: 3.2rem;
    }

    .cta-button {
      letter-spacing: 0.1em;
    }
  }
}

.locale-switcher {
  padding: 20px 0 0 20px;
}

.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 5rem;
}

.hero {
  display: flex;
  max-width: 760px;
  padding: 4rem 0 5rem;
  flex-direction: column;

  .search-bar-container input {
    border-radius: 24px;
    padding: 14px;
    background: var(--surface-raised-hover);
  }

  h1 {
    margin: 0.5rem 0 1rem;
    color: var(--text-primary);
    font-size: 3rem;
    font-weight: 300;
    line-height: 1.2;
  }

  p:not(.eyebrow) {
    max-width: 600px;
    margin: 0 0 3rem;
    color: var(--text-secondary);
    font-size: 1.25rem;
  }
}

.eyebrow {
  margin: 0;
  color: var(--text-accent);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.module-section {
  padding-top: 2.5rem;
  border-top: var(--border-subtle);
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0.45rem 0 0;
    color: var(--text-primary);
    font-size: clamp(1.6rem, 3vw, 2.25rem);
  }
}

.module-count {
  display: inline-flex;
  min-width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--surface-raised-hover);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.module-card {
  display: flex;
  min-height: 170px;
  box-sizing: border-box;
  padding: 1.5rem;
  flex-direction: column;
  gap: 0.75rem;
  border: var(--border-default);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: var(--text-accent);
    box-shadow: var(--shadow-sm, 0 8px 24px rgb(0 0 0 / 6%));
    transform: translateY(-2px);
  }
}

.module-card-title {
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.35;
}

.module-card-description {
  flex: 1;
  color: var(--text-secondary);
  line-height: 1.55;
}

.module-card-action {
  color: var(--text-accent);
  font-size: 0.9rem;
  font-weight: 600;
}

.module-empty {
  margin: 0;
  color: var(--text-secondary);
}

@media (width <= 768px) {
  .home-page {
    padding: 0 1rem 4rem;
  }

  .hero {
    padding: 3rem 0 4rem;

    h1 {
      font-size: clamp(2rem, 6vw, 3rem);
    }
  }

  .module-grid {
    grid-template-columns: 1fr;
  }
}
</style>
