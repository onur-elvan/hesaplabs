<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <!-- Hero -->
    <div class="bg-white border rounded-2xl p-6 sm:p-10">
      <div class="flex flex-col sm:flex-row sm:items-center gap-5">
        <div class="w-full flex justify-center">
          <div
            class="w-full max-w-[520px] h-20 sm:h-24 flex items-center justify-center"
          >
            <img
              :src="logo"
              alt="hesaplabs"
              class="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        <div>
          <p class="text-gray-600 mt-2">
            Öğrenciler, muhasebeciler, mühendisler ve herkes için hızlı,
            anlaşılır ve mobil uyumlu hesaplama araçları.
          </p>

          <div class="flex flex-wrap gap-2 mt-4">
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              ⚡ Hızlı
            </span>
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              📱 Mobil uyumlu
            </span>
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              ✅ Pratik sonuç
            </span>
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              🇹🇷 odaklı
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content cards -->
    <div class="grid md:grid-cols-2 gap-4 mt-6">
      <div class="bg-white border rounded-2xl p-6">
        <h2 class="text-lg font-semibold">Neyi hedefliyoruz?</h2>
        <p class="text-gray-600 mt-2">
          Hesaplamaları tek bir yerde topluyoruz: eğitim, matematik, finans,
          muhasebe, sağlık ve günlük ihtiyaçlar. Zamanla daha fazla araç ve
          özellik ekleyerek kapsamı genişleteceğiz.
        </p>
      </div>

      <div class="bg-white border rounded-2xl p-6">
        <h2 class="text-lg font-semibold">Nasıl çalışıyor?</h2>
        <ul class="mt-3 space-y-2 text-gray-600">
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span>Bir hesaplayıcı seç, değerleri gir, anında sonucu gör.</span>
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span>Favorilerine ekleyip hızlı erişim sağlayabilirsin.</span>
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span>Son kullandıkların otomatik listelenir.</span>
          </li>
        </ul>
      </div>

      <div class="bg-white border rounded-2xl p-6 md:col-span-2">
        <h2 class="text-lg font-semibold">Önemli not</h2>
        <p class="text-gray-600 mt-2">
          Hesaplamalar bilgilendirme amaçlıdır. Resmî işlemler ve kritik
          kararlar için doğrulama yapmanı öneririz.
        </p>
      </div>
    </div>
    <div class="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
      <h3 class="font-semibold text-blue-700">🚀 Yakında Hesaplabs’te</h3>
      <ul class="mt-2 text-sm text-blue-700 space-y-1">
        <li>• Yapay zeka içerik analiz araçları</li>
        <li>• Döviz & piyasa simülasyonları</li>
        <li>• Daha gelişmiş matematik araçları</li>
      </ul>
    </div>

    <!-- Footer note -->
    <div class="mt-8 text-center text-xs text-gray-500">
      © {{ year }} hesaplabs — Sürekli geliştiriliyor.
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import logo from "../assets/yazili_logo.png";

const year = computed(() => new Date().getFullYear());
</script>
