// @/router/index.ts
import { createRouter, RouterView, type RouteRecord } from '@fuyeor/vue-router';
import { useTransitionBar } from '@fuyeor/interactify';
import { useLocaleStore } from '@fuyeor/commons';
import { LOCALE_REGEX } from '@/config/locales';

const { start, done } = useTransitionBar();

const appRoutes: Array<RouteRecord> = [
  {
    // NOTE: path follows WHATWG URL Pattern Standard
    // reference.fuyeor.com/en/
    path: '',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      public: true,
      overrideTitle: ['site.name', ':', 'site.title'],
    },
  },
  {
    // reference.fuyeor.com/:locale/:module
    // Module directory landing page, such as /en/ffm.
    path: ':module',
    name: 'Module',
    component: () => import('@/views/Document/Module.vue'),
    meta: {
      public: true,
    },
  },
  {
    // reference.fuyeor.com/:locale/:module/:navigation+
    // /ffm/overview -> module="ffm", navigation="overview"
    // /fer/formatter/rules -> module="fer", navigation="formatter/rules"
    path: ':module/:navigation+',
    name: 'Document',
    component: () => import('@/views/Document/Content.vue'),
    meta: {
      public: true,
    },
  },
  {
    // /{/:locale(${LOCALE_REGEX})}?/*
    // not found 必须放 childs 中，因为它没有参数导致无法匹配：
    // { name: 'NotFound', params: { locale: 'zh-hans' } }
    // 会引发循环重定向问题
    path: '/*', // 通配符路由，捕获所有未匹配的路径
    name: 'NotFound',
    component: () =>
      import('@fuyeor/interactify/views').then((m) => m.NotFoundView),
    meta: {
      public: true,
      titleKey: 'notFound.title',
    },
  },
];

// root router
const routes: Array<RouteRecord> = [
  {
    // Root path is handled by the locale guard before rendering a page.
    path: '',
    name: 'Root',
    component: RouterView,
    meta: {
      public: true,
    },
  },
  {
    // Locale is required here to prevent dynamic module routes from consuming it.
    path: `/:locale(${LOCALE_REGEX})`,
    component: RouterView,
    // All application routes live below the locale prefix.
    children: appRoutes,
  },
];

const router = createRouter({ routes });

router.beforeEach(async (to, from) => {
  // 启动顶部进度条
  start();

  // 获取语言 store
  const localeStore = useLocaleStore();

  // 从路由参数中获取 locale (例如 'en' 或 undefined)
  const routeLocale = to.params.locale as string | undefined;

  // Redirect the root route to the localized home page.
  if (!routeLocale) {
    return {
      name: 'Home',
      params: { ...to.params, locale: localeStore.locale },
    };
  }

  // 如果路由中有语言参数，且与当前 store 中的不一致，强制切换
  // 这会触发 initializeLocale 中的 loadLocaleMessages，加载新语言包
  if (routeLocale && routeLocale !== localeStore.locale) {
    try {
      await localeStore.setLocale(routeLocale);
    } catch (e) {
      console.error('[RouterGuard] Failed to load locale:', e);
      // 加载语言失败不应该阻塞跳转，只不过界面可能显示默认语言
    }
  }

  // 如果代码能执行到这里，说明所有检查都通过了，允许导航
  return true;
});

router.afterEach(() => {
  done();
});

router.onError(() => {
  done();
});

export default router;
