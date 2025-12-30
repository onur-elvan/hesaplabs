<template>
  <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
        Kodlama Araçları
      </h1>
      <p class="text-slate-600 text-sm sm:text-base max-w-2xl">
        JSON, Base64, URL ve benzeri veri formatlarını hızla dönüştür, doğrula
        ve biçimlendir. Tüm işlemler tarayıcında gerçekleşir, verilerin sunucuya
        gönderilmez.
      </p>
    </section>

    <section>
      <h2
        class="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide"
      >
        Tüm Araçlar
      </h2>

      <div
        class="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        <RouterLink
          v-for="tool in codeTools"
          :key="tool.slug"
          :to="{ name: 'code-tool-detail', params: { slug: tool.slug } }"
          class="group block rounded-2xl border p-4 sm:p-5 bg-white hover:shadow-md hover:border-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div class="text-xs font-medium text-slate-500 mb-2">
            {{ tool.category }}
          </div>

          <h2 class="text-base sm:text-lg font-semibold text-slate-900 mb-1">
            {{ tool.name }}
          </h2>

          <p class="text-xs sm:text-sm text-slate-600 mb-4">
            {{ tool.shortDescription }}
          </p>

          <div
            class="mt-4 flex items-center justify-between text-xs text-slate-500"
          >
            <span>{{ tool.difficulty }}</span>

            <!-- Artık sadece görsel bir metin, link değil -->
            <span
              class="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700"
            >
              Aracı aç
              <span
                class="ml-1 group-hover:translate-x-0.5 transition-transform"
              >
                →
              </span>
            </span>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { codeTools } from "../data/codeTools";
</script>
