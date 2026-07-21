<!-- @/components/Document/PrevNext.vue -->
<template>
  <!-- Only renders when at least one navigation card is available -->
  <div v-if="prev || next" class="fuyeor-prev-next-nav">
    <!-- Previous Page Card -->
    <div class="nav-card-wrapper left">
      <router-link v-if="prev" :to="prev.path" class="nav-card prev-card">
        <span class="nav-label">← {{ t('pagination.prev') }}</span>
        <span class="nav-title">{{ prev.title }}</span>
      </router-link>
    </div>

    <!-- Next Page Card -->
    <div class="nav-card-wrapper right">
      <router-link v-if="next" :to="next.path" class="nav-card next-card">
        <span class="nav-label">{{ t('pagination.next') }} →</span>
        <span class="nav-title">{{ next.title }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '@fuyeor/locale';

interface NavItem {
  title: string;
  path: string;
}

defineProps<{
  prev: NavItem | null;
  next: NavItem | null;
}>();

const { t } = useLocale();
</script>

<style scoped>
.fuyeor-prev-next-nav {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
}
.nav-card-wrapper {
  flex: 1;
  min-width: 0; /* Prevents text overflow in narrow layout flex items */
}
.nav-card-wrapper.left {
  text-align: left;
}
.nav-card-wrapper.right {
  text-align: right;
}
.nav-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.25rem;
  border: var(--border-subtle);
  border-radius: var(--radius-md);
  transition: all 0.2s ease-in-out;
}
.nav-card:hover {
  box-shadow: var(--input-border-shadow);
}
.nav-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  font-weight: 600;
}
.nav-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ≤ 1000px (mobile) */
@media (width <= 768px) {
  .fuyeor-prev-next-nav {
    flex-direction: column;
  }
}
</style>
