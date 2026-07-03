// @/config/sidebar/menu.config.ts
import { getIconUrl } from '@fuyeor/commons';
import type { SidebarItemConfig } from '@fuyeor/interactify';

export const signedOutNavItemsRaw: SidebarItemConfig[] = [
  {
    target: '/welcome',
    icon: getIconUrl('home'),
    textKey: 'home',
  },
];
