// @/composables/loader/useMarkdownComponents.ts
import { defineAsyncComponent, defineComponent, h, type PropType } from 'vue';
import type { MarkdownPlugin } from '@fuyeor/interactify';

/**
 * 提供异步加载的 MarkdownRenderer 组件。
 * 这个加载器现在会自动为 MarkdownRenderer 注入通用的插件。
 */
export const MarkdownRenderer = defineAsyncComponent(async () => {
  // 异步加载我们真正的 MarkdownRenderer 组件
  const { MarkdownRenderer } = await import('@fuyeor/interactify/components');

  // 使用 defineComponent 创建一个类型安全的包装器组件
  return defineComponent({
    // 从 MarkdownRenderer.vue 中获取 props 定义，确保类型安全
    props: {
      content: {
        type: String as PropType<string | null>,
        default: null,
      },
      isEmbedded: {
        type: Boolean,
        default: false,
      },
      plugins: {
        type: Array as PropType<MarkdownPlugin[]>,
        default: () => [],
      },
    },

    // setup 函数负责核心逻辑
    setup(props, { attrs, slots }) {
      // 使用渲染函数 `h` 来渲染原始组件，并将所有 props、attrs 和合并后的新 plugins 传递下去
      return () =>
        h(
          MarkdownRenderer,
          {
            ...props,
            ...attrs,
          },
          slots,
        );
    },
  });
});
