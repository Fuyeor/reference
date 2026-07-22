<!-- @/views/Home.vue -->
<template>
  <locale-switcher
    :supported-locales="SUPPORTED_LOCALES"
    @change="handleLocaleChange"
  />

  <div class="intro-layout">
    <!-- Hero Section -->
    <section class="hero">
      <h1 v-html="t('intro.title')"></h1>
      <p>{{ t('intro.desc') }}</p>

      <SearchBar />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from '@fuyeor/vue-router';
import { useLocale } from '@fuyeor/locale';
import { LocaleSwitcher, SearchBar } from '@fuyeor/interactify';
import { SUPPORTED_LOCALES } from '@/config/locales';

const route = useRoute();
const router = useRouter();

const { t } = useLocale();

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

.intro-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero Section */
.hero {
  display: flex;
  padding: 4rem 0;
  flex-direction: column;

  .search-bar-container input {
    border-radius: 24px;
    padding: 14px;
    background: var(--surface-raised-hover);
  }

  h1 {
    font-size: 3rem;
    color: var(--text-primary);
    font-weight: 300;
    line-height: 1.2;
  }

  p {
    font-size: 1.25rem;
    color: var(--text-secondary);
    margin-bottom: 3rem;
    max-width: 600px;
  }

  @media (width <= 768px) {
    .hero {
      .hero-content {
        .cta-button {
          padding: 0.5rem 1.5rem;
        }
      }
    }
  }
  @media (width <= 600px) {
    .hero .hero-content h1 {
      font-size: clamp(2rem, 6vw, 3rem);
    }
  }
}
</style>
