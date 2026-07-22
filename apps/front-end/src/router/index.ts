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
    // *required* locale prefix wrapper, only allows supported locales
    // 需要可选组，因为用户访问 / 时，Matcher 需要能匹配
    // 进来之后，beforeEach 守卫才能抓住他重定向到正确的 /{locale}/
    path: `{/:locale(${LOCALE_REGEX})}?`,
    component: RouterView,
    // 将所有应用路由放入 children
    // 注意：子路由的 path 如果不以 / 开头，会拼接在父路由后面
    // 例如：/en/thought/123 或 /thought/123
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

  // 如果没有语言参数就跳转到语言页
  if (!routeLocale) {
    return {
      name: to.name,
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
