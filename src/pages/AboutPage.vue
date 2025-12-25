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
          <h1 class="text-xl sm:text-2xl font-bold">Hesaplabs nedir?</h1>
          <p class="text-gray-600 mt-2">
            Hesaplabs, tekrarlayan hesapları ve küçük “elle işlem” adımlarını
            saniyeler içinde çözen bir hesaplama platformudur. Öğrencilerden
            muhasebecilere, mühendislerden yazılımcılara kadar herkesin işini
            kolaylaştırmayı hedefler.
          </p>

          <div class="flex flex-wrap gap-2 mt-4">
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              ⚡ Hızlı ve pratik
            </span>
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              📱 Mobil uyumlu
            </span>
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              📊 Grafik & tablo destekli
            </span>
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              🧩 JSON & geliştirici araçları
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content cards -->
    <div class="grid md:grid-cols-2 gap-4 mt-6">
      <!-- Hedef -->
      <div class="bg-white border rounded-2xl p-6">
        <h2 class="text-lg font-semibold">Neyi hedefliyoruz?</h2>
        <p class="text-gray-600 mt-2">
          Amaç, “hesap makinesi + defter” kombinasyonunu ortadan kaldırmak.
          Formüllerle uğraşmak yerine, neyi bilip neyi aradığını yazıyorsun;
          Hesaplabs gerisini senin yerine hesaplıyor. Eğitim, matematik, fizik,
          finans, muhasebe, sağlık ve günlük hayat için onlarca hesaplama
          aracını tek bir yerde topluyoruz.
        </p>
      </div>

      <!-- Kimler için -->
      <div class="bg-white border rounded-2xl p-6">
        <h2 class="text-lg font-semibold">Kimler için?</h2>
        <ul class="mt-3 space-y-2 text-gray-600">
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              >Öğrenciler ve öğretmenler: sınav, not, matematik ve fizik
              hesapları için.</span
            >
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              >Muhasebeciler ve finans çalışanları: net–brüt maaş, KDV, faiz,
              kârlılık vb. için.</span
            >
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              >Mühendisler ve analistler: grafik tabanlı, türev–integral,
              fiziksel büyüklük hesapları için.</span
            >
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              >Geliştiriciler: JSON Formatter ve benzeri yardımcı araçlar
              için.</span
            >
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span>
              Günlük kullanıcılar: zam/indirim, oran-orantı, BMI, su ihtiyacı
              gibi pratik hesaplamalar için.
            </span>
          </li>
        </ul>
      </div>

      <!-- Neler var -->
      <div class="bg-white border rounded-2xl p-6">
        <h2 class="text-lg font-semibold">Şu an neler bulabilirsin?</h2>
        <ul class="mt-3 space-y-2 text-gray-600 text-sm">
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              ><strong>Matematik & geometri:</strong> limit, türev, integral,
              fonksiyon grafikleri, alan–çevre hesapları ve daha fazlası.</span
            >
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              ><strong>Fizik:</strong> hız–yol–zaman, dalga boyu–frekans–enerji,
              ivme, dikey atış ve serbest düşme gibi kavramlar ve
              dahası...</span
            >
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              ><strong>kimya:</strong> Mol-Kütle Dönüşümü, PH Hesaplama, Yüzde
              Derişim Hesaplama Mol Hesaplama gibi kavramlar ve dahası...</span
            >
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              ><strong>Finans & muhasebe:</strong> net/brüt maaş, KDV, faiz, kâr
              marjı, e-ticaret kârlılığı ve diğer iş hesapları.</span
            >
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              ><strong>Eğitim & sınav:</strong> TYT/AYT, ALES, KPSS, not
              ortalaması, vize–final ve belge hesaplamaları ve dahası...</span
            >
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              ><strong>Sağlık:</strong> BMI, BMR/TDEE, bel–kalça oranı, vücut
              yağ oranı gibi temel göstergeler ve dahası...</span
            >
          </li>
        </ul>
      </div>

      <!-- JSON & geliştirici araçları -->
      <div class="bg-white border rounded-2xl p-6">
        <h2 class="text-lg font-semibold">
          JSON Formatter & geliştirici araçları
        </h2>
        <p class="text-gray-600 mt-2">
          Hesaplabs sadece klasik hesap makinelerinden ibaret değil. JSON
          Formatter aracı ile JSON verilerini:
        </p>
        <ul class="mt-3 space-y-2 text-gray-600 text-sm">
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              >Doğrulayabilir (validate) ve formatlayabilirsin (beautify /
              minify).</span
            >
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span
              >JSONPath ile içinden alan arayabilir, dosya yükleyip
              indirebilirsin.</span
            >
          </li>
          <li class="flex gap-2">
            <span class="text-gray-400">•</span>
            <span>JSON ↔ JSONL dönüşümleri yapabilirsin.</span>
          </li>
        </ul>
        <p class="text-gray-600 mt-3 text-sm">
          Tüm işlemler tarayıcı içinde gerçekleşir; veriler sunucuya
          gönderilmez.
        </p>
      </div>

      <!-- Önemli not -->
      <div class="bg-white border rounded-2xl p-6 md:col-span-2">
        <h2 class="text-lg font-semibold">Önemli not</h2>
        <p class="text-gray-600 mt-2">
          Hesaplamalar bilgilendirme ve hız kazandırma amacı taşır. Vergi,
          sözleşme, sağlık veya kritik teknik kararlar için, resmi kaynaklardan
          veya uzman görüşünden ayrıca doğrulama yapmanı öneririz.
        </p>
      </div>
    </div>

    <!-- Yakında -->
    <div class="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
      <h3 class="font-semibold text-blue-700">🚀 Yakında Hesaplabs’te</h3>
      <ul class="mt-2 text-sm text-blue-700 space-y-1">
        <li>• Yapay zeka destekli içerik ve veri analiz araçları</li>
        <li>
          • Döviz & piyasa simülasyonları ve finansal senaryo hesaplayıcıları
        </li>
        <li>• Daha gelişmiş matematik ve mühendislik hesaplayıcıları</li>
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
