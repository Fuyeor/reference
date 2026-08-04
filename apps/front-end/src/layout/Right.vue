<!-- @/layout/Right.vue -->
<template>
  <div class="right-sidebar">
    <SearchBar :target-path="localePath('/search')" />

    <!-- 右侧边栏传送区-->
    <div id="sidebar-wrapper"></div>

    <RightFooter />
  </div>
</template>

<script setup lang="ts">
import { SearchBar, RightFooter } from '@fuyeor/interactify';
import { useLocalePath } from '@/composables/useLocalePath';

const localePath = useLocalePath();
</script>

<style>
.right-sidebar {
  padding: 30px 30px 30px 20px;

  h3:after {
    content: none;
  }

  .search-bar-container input {
    padding: 16px;
  }

  #sidebar-wrapper {
    padding: 0 10px;
  }
}
</style>
