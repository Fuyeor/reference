<!-- @/components/Document/RecentlyRead.vue -->
<template>
  <!-- Only renders when there is at least one history item available -->
  <div v-if="history.length > 0" class="recently-read">
    <div class="recently-read-header">
      <h3>{{ t('doc.recentlyRead') }}</h3>
      <button class="remove-btn" @click="clearHistory">✕</button>
    </div>

    <nav>
      <router-link
        v-for="item in history"
        :key="item.path"
        :to="item.path"
        class="nav-entry"
      >
        {{ item.title }}
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '@fuyeor/locale';
import { useRecentlyRead } from '@/composables/useRecentlyRead';

const { history, clearHistory } = useRecentlyRead();
const { t } = useLocale();
</script>

<style scoped>
.recently-read {
  .recently-read-header {
    display: flex;
    gap: 0.5rem;
  }
  .remove-btn:hover {
    color: var(--color-danger);
  }
  .nav-entry {
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.3s;
  }
  .nav-entry:hover {
    color: var(--text-accent);
  }
}
</style>
