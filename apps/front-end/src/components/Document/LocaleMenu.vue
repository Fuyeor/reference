<!-- @/components/Document/LocaleMenu.vue -->
<template>
  <!-- Render our unified dropdown menu with a global language icon -->
  <DropdownMenu :trigger-icon="getIconUrl('langs')" :items="localeItems" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from '@fuyeor/vue-router';
import { getIconUrl } from '@fuyeor/commons';
import { DropdownMenu, type DropdownItem } from '@fuyeor/interactify';

const props = defineProps<{
  locales: string[]; // E.g., ['zh-hans', 'en'] from compiled index.json
}>();

const route = useRoute();
const router = useRouter();

interface LocaleConfig {
  code: string;
  name: string;
}

// Local supported locales dictionary
const SUPPORTED_LOCALES: Record<string, LocaleConfig> = {
  en: { code: 'en', name: 'English' },
  'zh-hans': { code: 'zh-hans', name: '简体中文' },
  'zh-hant': { code: 'zh-hant', name: '繁體中文' },
};

// Handle locale switching and trigger seamless SPA route parameter replacement
const handleLocaleChange = (newLocale: string) => {
  router.replace({
    name: route.name,
    params: { locale: newLocale },
  });
};

// Map the physical available locales + automated zh-hant into unified DropdownItems
const localeItems = computed<DropdownItem[]>(() => {
  const list = [...props.locales];

  // Automatically insert a `zh-hant` option immediately to the right of `zh-hans`
  if (list.includes('zh-hans')) {
    const hansIndex = list.indexOf('zh-hans');
    list.splice(hansIndex + 1, 0, 'zh-hant');
  }

  return list.map((code) => {
    const config = SUPPORTED_LOCALES[code] || { code, name: code };
    return {
      label: config.name,
      action: () => handleLocaleChange(config.code),
    };
  });
});
</script>
