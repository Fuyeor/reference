<!-- @/components/Document/LocaleMenu.vue -->
<template>
  <DropdownMenu :trigger-icon="getIconUrl('langs')" :items="localeItems" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from '@fuyeor/vue-router';
import { getIconUrl } from '@fuyeor/commons';
import { DropdownMenu, type DropdownItem } from '@fuyeor/interactify';
import { getAvailableLocales, getLocaleName } from '@/config/locales';

const props = defineProps<{
  locales: string[];
}>();

const route = useRoute();
const router = useRouter();

// Handle locale switching and trigger seamless SPA route parameter replacement.
const handleLocaleChange = (newLocale: string) => {
  router.replace({
    name: route.name,
    params: { locale: newLocale },
  });
};

const localeItems = computed<DropdownItem[]>(() => {
  return getAvailableLocales(props.locales).map((code) => ({
    label: getLocaleName(code),
    action: () => handleLocaleChange(code),
  }));
});
</script>
