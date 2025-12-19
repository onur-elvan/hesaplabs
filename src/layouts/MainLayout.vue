<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <!-- Sticky Back Bar (mobilde çok iyi) -->
    <div
      v-if="showBack"
      class="sticky top-0 z-40 border-b bg-white/90 backdrop-blur"
      style="padding-top: env(safe-area-inset-top)"
    >
      <div
        class="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3"
      >
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border bg-white hover:shadow active:scale-[0.99]"
        >
          ← Geri
        </button>

        <!-- İstersen sağ tarafa küçük bir başlık gösterebiliriz -->
        <div class="text-sm text-gray-500 truncate">
          {{ pageTitle }}
        </div>
      </div>
    </div>

    <main class="flex-1">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// Ana sayfada geri butonu görünmesin
const showBack = computed(() => route.path !== "/");

// Basit sayfa başlığı (route'a göre)
const pageTitle = computed(() => {
  if (route.path.startsWith("/c/")) return "Hesaplayıcı";
  if (route.path === "/about") return "Hakkında";
  return "";
});

function goBack() {
  // geçmiş yoksa ana sayfaya dönsün (daha sağlam UX)
  if (window.history.length > 1) router.back();
  else router.push("/");
}
</script>
