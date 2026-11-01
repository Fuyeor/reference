<!-- @app/component/left.vue -->
<template>
  <LeftSidebar>
    <template #nav>
      <Foldable
        :foldable="layoutState.shouldShow"
        :modelValue="!layoutState.shouldShow"
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
import { useRoute } from '@fuyeor/vue-router';
import { t } from '@fuyeor/vue-locale';
import { getIconUrl } from '@fuyeor/commons';
import { useSidebarItems } from '@fuyeor/interactify';
import {
  LeftSidebar,
  Foldable,
  SidebarMenu,
  SidebarUserCard,
} from '@fuyeor/interactify';
import { useLayoutState } from '@app/state/layout';
import { signedOutNavItemsRaw } from '@app/config/sidebar/menu.config';
import type { SidebarItem } from '@fuyeor/interactify';

const route = useRoute();
const layoutState = useLayoutState();

// 生成主导航项
const { processedItems: signedOutNavItems } = useSidebarItems(
  signedOutNavItemsRaw,
  { t },
);
</script>
