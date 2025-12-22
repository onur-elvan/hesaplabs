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

      <!-- ✅ SEO Bilgi -->
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

      <!-- Inputs -->
      <div class="grid sm:grid-cols-2 gap-4 mt-6">
        <div v-for="input in visibleInputs" :key="input.key">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ input.label }}
          </label>

          <input
            v-if="input.type === 'number'"
            v-model="values[input.key]"
            type="number"
            inputmode="decimal"
            class="w-full px-4 py-2 rounded-lg border"
            :placeholder="input.placeholder"
          />

          <input
            v-else-if="input.type === 'text'"
            v-model="values[input.key]"
            type="text"
            class="w-full px-4 py-2 rounded-lg border"
            :placeholder="input.placeholder"
          />

          <textarea
            v-else-if="input.type === 'textarea'"
            v-model="values[input.key]"
            class="w-full px-4 py-2 rounded-lg border"
            :placeholder="input.placeholder"
            :rows="input.rows || 5"
          ></textarea>

          <input
            v-else-if="input.type === 'date'"
            v-model="values[input.key]"
            type="date"
            class="w-full px-4 py-2 rounded-lg border bg-white"
          />

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

          <input
            v-else
            v-model="values[input.key]"
            type="text"
            class="w-full px-4 py-2 rounded-lg border"
            :placeholder="input.placeholder"
          />
        </div>
      </div>

      <!-- Advanced -->
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

      <!-- SONUÇ -->
      <div v-if="result" class="mt-6 rounded-xl bg-gray-50 border p-4">
        <h2 class="font-semibold">Sonuç</h2>

        <!-- Grafik (SVG) -->
        <div v-if="plotSvg" class="mt-4">
          <h3 class="text-sm font-semibold text-gray-800 mb-2">Grafik</h3>

          <div class="rounded-xl border bg-white p-3 overflow-x-auto">
            <div class="min-w-[520px]" v-html="plotSvg"></div>
          </div>

          <p v-if="plotCaption" class="mt-2 text-xs text-gray-500">
            {{ plotCaption }}
          </p>
        </div>

        <!-- Tablo -->
        <div v-if="tableRows.length" class="mt-4">
          <h3 class="text-sm font-semibold text-gray-800 mb-2">Tablo</h3>

          <div class="rounded-xl border bg-white overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="(h, i) in tableHeaders"
                    :key="i"
                    class="text-left px-3 py-2 font-semibold text-gray-700 border-b whitespace-nowrap"
                  >
                    {{ h }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(row, rIdx) in normalizedTableRows"
                  :key="rIdx"
                  class="hover:bg-gray-50"
                >
                  <td
                    v-for="(h, i) in tableHeaders"
                    :key="i"
                    class="px-3 py-2 border-b text-gray-800 align-top"
                  >
                    <span class="break-words">
                      {{ formatCell(row[h]) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="tableNote" class="mt-2 text-xs text-gray-500">
            {{ tableNote }}
          </div>
        </div>

        <!-- Normal sonuç kartları -->
        <div v-if="resultEntries.length" class="grid sm:grid-cols-2 gap-3 mt-4">
          <div
            v-for="[key, val] in resultEntries"
            :key="key"
            class="bg-white rounded-lg border p-3"
          >
            <h3 class="text-xs uppercase tracking-wide text-gray-500">
              {{ key }}
            </h3>

            <div
              class="text-lg font-semibold text-gray-800 overflow-x-auto"
              :class="valueClass(val)"
              :title="isLongString(val) ? String(val) : ''"
            >
              {{ format(val) }}
            </div>
          </div>
        </div>

        <div
          v-if="!resultEntries.length && (plotSvg || tableRows.length)"
          class="mt-3 text-xs text-gray-500"
        >
          Not: Bu hesaplama grafik/tablo formatında sonuç üretir.
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

  if (typeof window.gtag === "function") {
    window.gtag("event", "calculate_click", {
      calculator_id: calc.value.id,
      calculator_title: calc.value.title,
      category: calc.value.category,
      page_path: route.fullPath,
    });
  }

  const out = calc.value.compute(values);
  result.value = out;

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

/** ---------------------------
 *  SONUÇ: Grafik / Tablo / Kart
 *  Konvansiyon:
 *   result.__plot: string(svg) veya { svg, caption }
 *   result.__table: { headers?:[], rows:[] , note?:string }  (rows: array<object> veya array<array>)
 * -------------------------- */
const plotSvg = computed(() => {
  const out = result.value;
  if (!out || typeof out !== "object") return "";

  const p = out.__plot || out.plot || out.__plotSvg;
  if (!p) return "";

  if (typeof p === "string") return p;
  if (typeof p === "object" && typeof p.svg === "string") return p.svg;

  return "";
});

const plotCaption = computed(() => {
  const out = result.value;
  if (!out || typeof out !== "object") return "";
  const p = out.__plot || out.plot || out.__plotSvg;
  if (p && typeof p === "object" && p.caption) return String(p.caption);
  return "";
});

const tableData = computed(() => {
  const out = result.value;
  if (!out || typeof out !== "object") return null;
  return out.__table || out.table || null;
});

const tableRows = computed(() => {
  const t = tableData.value;
  if (!t) return [];

  if (t && typeof t === "object" && Array.isArray(t.rows)) return t.rows;
  if (Array.isArray(t)) return t;

  return [];
});

const tableHeaders = computed(() => {
  const t = tableData.value;
  const rows = tableRows.value;

  if (
    t &&
    typeof t === "object" &&
    Array.isArray(t.headers) &&
    t.headers.length
  )
    return t.headers.map(String);

  // array-of-array ise headers otomatik: col1,col2...
  if (rows.length && Array.isArray(rows[0])) {
    return rows[0].map((_, idx) => `col${idx + 1}`);
  }

  // array-of-object ise union keys
  const keys = new Set();
  for (const r of rows) {
    if (r && typeof r === "object" && !Array.isArray(r)) {
      Object.keys(r).forEach((k) => keys.add(k));
    }
  }
  return Array.from(keys);
});

const normalizedTableRows = computed(() => {
  const rows = tableRows.value;
  if (!rows.length) return [];

  // array-of-array -> object'a çevir
  if (Array.isArray(rows[0])) {
    const headers = tableHeaders.value;
    return rows.map((arr) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = arr[i]));
      return obj;
    });
  }

  return rows;
});

const tableNote = computed(() => {
  const t = tableData.value;
  if (t && typeof t === "object" && t.note) return String(t.note);
  return "";
});

const resultEntries = computed(() => {
  const out = result.value;

  if (typeof out === "string" || typeof out === "number") {
    return [["sonuc", out]];
  }

  if (!out || typeof out !== "object") return [];

  return Object.entries(out).filter(([k]) => {
    if (k.startsWith("__")) return false; // __plot, __table vs
    if (k === "plot" || k === "table") return false;
    return true;
  });
});

function format(val) {
  if (typeof val === "number") {
    return new Intl.NumberFormat("tr-TR", {
      maximumFractionDigits: 2,
    }).format(val);
  }

  if (val && typeof val === "object") {
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }

  return val;
}

function isLongString(val) {
  return typeof val === "string" && val.length > 28;
}

function valueClass(val) {
  // uzun tek satır değerler (IBAN vb.) taşmasın:
  if (typeof val === "string") return "break-all";
  return "";
}

function formatCell(v) {
  if (typeof v === "number") return format(v);
  if (v == null) return "";
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

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
