<!-- @/layout/Left.vue -->
<template>
  <LeftSidebar>
    <template #nav>
      <Foldable
        :foldable="layoutStore.shouldShow"
        :modelValue="!layoutStore.shouldShow"
        :title="t('workspace')"
        :icon-url="getIconUrl('home')"
      >
        <SidebarMenu :items="signedOutNavItems" />
      </Foldable>

      <div id="left-sidebar-anchor"></div>
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
import { useLayoutStore } from '@/stores/layout';
import { signedOutNavItemsRaw } from '@/config/sidebar/menu.config';
import type { SidebarItem } from '@fuyeor/interactify';

const { t } = useLocale();
const { isMobile } = useMobileDetection();

const route = useRoute();
const layoutStore = useLayoutStore();

// 生成主导航项
const { processedItems: signedOutNavItems } = useSidebarItems(
  signedOutNavItemsRaw,
  { t },
);
</script>
