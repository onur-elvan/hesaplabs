<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div v-if="calc" class="bg-white rounded-xl border p-6">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-sm text-gray-500">{{ calc.category }}</div>
          <h1 class="text-2xl font-bold mt-1">{{ calc.title }}</h1>
        </div>

        <button
          @click="onToggleFav"
          class="shrink-0 w-10 h-10 rounded-lg border bg-white hover:shadow active:scale-[0.99]"
          :aria-label="isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'"
          title="Favori"
        >
          <span class="text-xl">{{ isFav ? "⭐" : "☆" }}</span>
        </button>
      </div>

      <p class="text-gray-600 mt-2">{{ calc.description }}</p>

      <!-- ✅ SEO Bilgi: calc.seoText varsa onu, yoksa otomatik metni göster -->
      <div
        v-if="seoText"
        class="mt-5 rounded-xl border bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed"
      >
        <h2 class="font-semibold text-gray-900 mb-2">Bilgi</h2>
        <p class="whitespace-pre-line">{{ seoText }}</p>
      </div>

      <!-- Bilgilendirme kutusu (varsa) -->
      <div v-if="calc.info" class="mt-5 rounded-xl border bg-blue-50 p-4">
        <div class="font-semibold text-gray-900">
          {{ calc.info.title || "Bilgilendirme" }}
        </div>

        <ul
          v-if="calc.info.items?.length"
          class="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1"
        >
          <li v-for="(it, idx) in calc.info.items" :key="idx">{{ it }}</li>
        </ul>

        <div v-if="calc.info.disclaimer" class="mt-3 text-xs text-gray-600">
          {{ calc.info.disclaimer }}
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4 mt-6">
        <div v-for="input in visibleInputs" :key="input.key">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ input.label }}
          </label>

          <!-- Number -->
          <input
            v-if="input.type === 'number'"
            v-model="values[input.key]"
            type="number"
            inputmode="decimal"
            class="w-full px-4 py-2 rounded-lg border"
            :placeholder="input.placeholder"
          />

          <!-- Text -->
          <input
            v-else-if="input.type === 'text'"
            v-model="values[input.key]"
            type="text"
            class="w-full px-4 py-2 rounded-lg border"
            :placeholder="input.placeholder"
          />

          <!-- Date -->
          <input
            v-else-if="input.type === 'date'"
            v-model="values[input.key]"
            type="date"
            class="w-full px-4 py-2 rounded-lg border bg-white"
          />

          <!-- Select -->
          <select
            v-else-if="input.type === 'select'"
            v-model="values[input.key]"
            class="w-full px-4 py-2 rounded-lg border bg-white"
          >
            <option
              v-for="opt in input.options"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="hasAdvanced" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Daha doğru sonuç için gelişmiş ayarları kullanabilirsin.
        </div>

        <button
          class="text-sm px-3 py-2 rounded-lg border bg-white hover:shadow"
          @click="showAdvanced = !showAdvanced"
          type="button"
        >
          {{
            showAdvanced
              ? "Gelişmiş Ayarları Gizle"
              : "Gelişmiş Ayarları Göster"
          }}
        </button>
      </div>

      <button
        class="mt-6 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        @click="run"
      >
        Hesapla
      </button>

      <div v-if="result" class="mt-6 rounded-xl bg-gray-50 border p-4">
        <h2 class="font-semibold">Sonuç</h2>

        <div class="grid sm:grid-cols-2 gap-3 mt-3">
          <div
            v-for="(val, key) in result"
            :key="key"
            class="bg-white rounded-lg border p-3"
          >
            <h3 class="text-xs uppercase tracking-wide text-gray-500">
              {{ key }}
            </h3>

            <div class="text-lg font-semibold text-gray-800 result-value">
              {{ format(val) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-600">Böyle bir hesaplayıcı bulunamadı.</div>
  </div>
</template>

<script setup>
import { reactive, ref, watchEffect, computed } from "vue";
import { useRoute } from "vue-router";
import {
  findCalculatorById,
  addRecent,
  getFavorites,
  toggleFavorite,
} from "../registry/calculators";
import { useSeo } from "../composables/useSeo";

const route = useRoute();
const calc = ref(null);
const values = reactive({});
const result = ref(null);
const showAdvanced = ref(false);

const baseUrl = "https://hesaplabs.com";
const pageUrl = computed(() => `${baseUrl}${route.fullPath}`);

const hasAdvanced = computed(
  () => calc.value?.inputs?.some((i) => i.advanced) ?? false
);

const visibleInputs = computed(() => {
  if (!calc.value) return [];
  return calc.value.inputs.filter((i) => !i.advanced || showAdvanced.value);
});

const favs = ref(getFavorites());
const isFav = computed(() => calc.value && favs.value.includes(calc.value.id));

function onToggleFav() {
  if (!calc.value) return;
  favs.value = toggleFavorite(calc.value.id);
}

// ✅ aynı sayfada tekrar tekrar view event basmamak için küçük koruma
let lastViewedId = null;

watchEffect(() => {
  calc.value = findCalculatorById(route.params.id);

  if (calc.value) {
    addRecent(calc.value.id);

    // ✅ GA4: sayfa görüntülendi
    if (typeof window.gtag === "function" && lastViewedId !== calc.value.id) {
      lastViewedId = calc.value.id;
      window.gtag("event", "calculator_view", {
        calculator_id: calc.value.id,
        calculator_title: calc.value.title,
        category: calc.value.category,
        page_path: route.fullPath,
      });
    }
  }

  result.value = null;
  showAdvanced.value = false;

  Object.keys(values).forEach((k) => delete values[k]);
  if (calc.value) {
    for (const inp of calc.value.inputs) {
      values[inp.key] = inp.default ?? "";
    }
  }
});

/**
 * ✅ seoText fallback:
 * - calc.seoText varsa onu göster
 * - yoksa otomatik üret
 */
const seoText = computed(() => {
  if (!calc.value) return "";
  if (calc.value.seoText) return calc.value.seoText;

  const labels = (calc.value.inputs || [])
    .filter((i) => i?.label)
    .slice(0, 6)
    .map((i) => `- ${i.label}`)
    .join("\n");

  const cat = (calc.value.category || "Genel").toString().toLowerCase();

  return `
${
  calc.value.title
} aracı, ${cat} kategorisinde hızlı ve pratik hesaplama yapmanı sağlar.

Nasıl kullanılır:
${labels || "- Gerekli alanları doldur\n- Hesapla butonuna bas"}

Not: Sonuçlar bilgilendirme amaçlıdır. Resmi işlemler için ilgili kurum/uzman doğrulaması önerilir.
`.trim();
});

function run() {
  if (!calc.value) return;

  // 1) calculate_click: butona basıldı
  if (typeof window.gtag === "function") {
    window.gtag("event", "calculate_click", {
      calculator_id: calc.value.id,
      calculator_title: calc.value.title,
      category: calc.value.category,
      page_path: route.fullPath,
    });
  }

  // hesabı çalıştır
  const out = calc.value.compute(values);
  result.value = out;

  // 2) calculation_error / calculation_done
  if (typeof window.gtag === "function") {
    const isError = out && typeof out === "object" && "hata" in out;

    if (isError) {
      window.gtag("event", "calculation_error", {
        calculator_id: calc.value.id,
        calculator_title: calc.value.title,
        category: calc.value.category,
        page_path: route.fullPath,
        error_message: String(out.hata || "Bilinmeyen hata").slice(0, 120),
      });
    } else {
      window.gtag("event", "calculation_done", {
        calculator_id: calc.value.id,
        calculator_title: calc.value.title,
        category: calc.value.category,
        page_path: route.fullPath,
        result_keys:
          out && typeof out === "object"
            ? Object.keys(out).slice(0, 12).join(",")
            : "",
      });
    }
  }
}

function format(val) {
  if (typeof val === "number") {
    return new Intl.NumberFormat("tr-TR", {
      maximumFractionDigits: 2,
    }).format(val);
  }
  return val;
}

/**
 * ✅ C2 (Schema): Breadcrumb + SoftwareApplication (+ default WebPage useSeo'da zaten var)
 */
useSeo({
  title: computed(() =>
    calc.value
      ? `${calc.value.seoTitle || calc.value.title} | Hesaplabs`
      : "Hesaplabs | Akıllı Hesaplama Araçları"
  ),
  description: computed(() =>
    calc.value
      ? calc.value.description
      : "Finans, matematik, eğitim ve sağlık için hızlı ve mobil uyumlu hesaplayıcılar."
  ),

  canonical: pageUrl,
  ogUrl: pageUrl,
  ogType: "website",
  ogSiteName: "Hesaplabs",
  twitterCard: "summary_large_image",

  schema: computed(() => {
    if (!calc.value) return [];

    const title = `${calc.value.seoTitle || calc.value.title} | Hesaplabs`;

    return [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Hesaplabs",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Hesaplayıcılar",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: calc.value.title,
            item: pageUrl.value,
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: title,
        applicationCategory: "CalculatorApplication",
        operatingSystem: "Web",
        url: pageUrl.value,
        description: calc.value.description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
      },
    ];
  }),
});
</script>
