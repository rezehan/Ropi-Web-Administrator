<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <!-- Jika halaman BUKAN login, gunakan layout dengan sidebar -->
  <AppLayout v-if="!$route.meta.hideLayout">
    <router-view />
  </AppLayout>

  <!-- Jika halaman LOGIN, tampilkan full tanpa sidebar -->
  <router-view v-else />
</template>