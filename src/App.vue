<template>
  <MainLayout>
    <!-- Sayfa içeriği -->
    <RouterView />

    <!-- Çerez / gizlilik bannerı -->
    <CookieConsent />
  </MainLayout>
</template>

<script setup>
import MainLayout from "./layouts/MainLayout.vue";
import CookieConsent from "./components/CookieConsent.vue"; // ✅ BURAYI EKLE
</script>
