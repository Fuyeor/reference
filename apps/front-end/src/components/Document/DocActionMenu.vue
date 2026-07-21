<!-- @/components/Document/DocActionMenu.vue -->
<template>
  <DropdownMenu :items="actionItems" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from '@fuyeor/locale';
import { useToast, DropdownMenu, type DropdownItem } from '@fuyeor/interactify';

const props = defineProps<{
  content: string; // The raw compiled markdown string
  locale: string; // Active locale (e.g. 'zh-hans')
  module: string; // Current module name (e.g. 'ffm')
  navigation: string; // Current content path (e.g. 'overview')
}>();

const { t } = useLocale();
const { showToast } = useToast();

// Copy raw Markdown content natively using the modern Web Clipboard API (Zero dependency!)
const handleCopyMarkdown = async () => {
  try {
    await window.navigator.clipboard.writeText(props.content);
    showToast(t('copy.success'), { type: 'success' });
  } catch {
    showToast(t('copy.failed'), { type: 'error' });
  }
};

// Open the raw un-compiled Markdown file directly in a new tab
const handleOpenRawMarkdown = () => {
  const rawUrl = `/v1/content/${props.module}/${props.navigation}/${props.locale}.md`;
  window.open(rawUrl, '_blank');
};

// Navigate directly to GitHub's web editor for instant community contribution
const handleEditOnGitHub = () => {
  const gitHubEditUrl = `https://github.com/Fuyeor/reference/blob/main/content/${props.module}/${props.navigation}/${props.locale}.md`;
  window.open(gitHubEditUrl, '_blank');
};

// Construct the highly unified dropdown menu items
const actionItems = computed<DropdownItem[]>(() => [
  {
    label: t('doc.menu.copyMarkdown'),
    action: handleCopyMarkdown,
  },
  {
    label: t('doc.menu.openMarkdown'),
    action: handleOpenRawMarkdown,
  },
  {
    label: t('doc.menu.edit'),
    action: handleEditOnGitHub,
  },
]);
</script>
