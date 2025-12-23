<template>
  <div class="max-w-3xl mx-auto px-4 py-16 text-center">
    <div class="text-6xl font-bold text-blue-600">404</div>

    <h1 class="mt-4 text-2xl font-semibold text-gray-800">Sayfa bulunamadı</h1>

    <p class="mt-3 text-gray-600">
      Aradığın sayfa kaldırılmış olabilir, adresi yanlış yazmış olabilirsin veya
      geçici olarak erişilemiyor olabilir.
    </p>

    <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
      <RouterLink
        to="/"
        class="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Ana sayfaya dön
      </RouterLink>

      <button
        @click="goBack"
        class="inline-flex items-center justify-center px-5 py-3 rounded-lg border bg-white hover:shadow transition"
      >
        Geri git
      </button>
    </div>

    <div class="mt-10 text-xs text-gray-400">© {{ year }} Hesaplabs</div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const year = computed(() => new Date().getFullYear());

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push("/");
}
</script>
