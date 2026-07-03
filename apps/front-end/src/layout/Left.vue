<!-- @/layout/Left.vue -->
<template>
  <LeftSidebar>
    <template #nav>
      <SidebarMenu :items="signedOutNavItems" />
    </template>
  </LeftSidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '@fuyeor/vue-router';
import { useLocale } from '@fuyeor/locale';
import { getIconUrl, getAvatarUrl } from '@fuyeor/commons';
import { useMobileDetection, useSidebarItems } from '@fuyeor/interactify';
import {
  LeftSidebar,
  Foldable,
  SidebarMenu,
  SidebarUserCard,
} from '@fuyeor/interactify';
import { signedOutNavItemsRaw } from '@/config/sidebar/menu.config';
import type { SidebarItem } from '@fuyeor/interactify';

const { t } = useLocale();
const { isMobile } = useMobileDetection();

const route = useRoute();

// 生成主导航项
const { processedItems: signedOutNavItems } = useSidebarItems(
  signedOutNavItemsRaw,
  { t },
);
</script>
