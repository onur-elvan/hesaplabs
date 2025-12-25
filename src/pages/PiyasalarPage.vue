<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <!-- Başlık / Hero -->
    <div class="bg-white border rounded-2xl p-6 mb-6">
      <h1 class="text-2xl font-bold">
        Piyasalar – Canlı Döviz Kurları, Altın Fiyatı ve Kur Çevirici
      </h1>
      <p class="text-gray-600 mt-2">
        USD, EUR, GBP ve gram/ons altın fiyatları için hızlı kur çevirici.
        Veriler ExchangeRate-API ve MetalpriceAPI üzerinden günlük olarak
        güncellenir, sadece bilgilendirme amaçlıdır.
      </p>

      <div class="mt-3 text-sm text-gray-500 flex flex-wrap gap-3">
        <div v-if="lastUpdate">
          Son döviz güncelleme:
          <span class="font-medium">{{ lastUpdate }}</span>
        </div>
        <div v-if="loading" class="flex items-center gap-1">
          <span class="animate-pulse">•</span> Döviz kurları yükleniyor…
        </div>
        <div v-if="error" class="text-red-600">Hata: {{ error }}</div>

        <div v-if="metalsLastUpdate">
          Altın verisi (XAU) referans tarihi:
          <span class="font-medium">{{ metalsLastUpdate }}</span>
        </div>
        <div v-if="metalsLoading" class="flex items-center gap-1">
          <span class="animate-pulse">•</span> Altın fiyatı yükleniyor…
        </div>
        <div v-if="metalsError" class="text-red-600">
          Altın verisi: {{ metalsError }}
        </div>
      </div>
    </div>

    <!-- Özet kartları: Döviz -->
    <div
      v-if="!loading && !error && hasData"
      class="grid md:grid-cols-3 gap-4 mb-8"
    >
      <div class="bg-white border rounded-2xl p-4">
        <div class="text-xs text-gray-500 uppercase tracking-wide">Kur</div>
        <div class="mt-1 text-lg font-semibold">
          1 USD = {{ fmt(usdTry) }} TRY
        </div>
        <div class="mt-1 text-sm text-gray-600">
          Baz: ExchangeRate-API (USD tabanlı)
        </div>
      </div>

      <div class="bg-white border rounded-2xl p-4">
        <div class="text-xs text-gray-500 uppercase tracking-wide">Kur</div>
        <div class="mt-1 text-lg font-semibold">
          1 EUR = {{ fmt(eurTry) }} TRY
        </div>
        <div class="mt-1 text-sm text-gray-600">Hesap: USD → EUR → TRY</div>
      </div>

      <div class="bg-white border rounded-2xl p-4">
        <div class="text-xs text-gray-500 uppercase tracking-wide">Kur</div>
        <div class="mt-1 text-lg font-semibold">
          1 EUR = {{ fmt(eurUsd) }} USD
        </div>
        <div class="mt-1 text-sm text-gray-600">Doğrudan oran (EUR / USD)</div>
      </div>
    </div>

    <!-- Kur çevirici -->
    <div class="bg-white border rounded-2xl p-6 mb-8">
      <h2 class="text-lg font-semibold mb-3">Döviz Kur Çevirici</h2>

      <div class="grid md:grid-cols-[2fr_1fr_2fr] gap-3 items-center">
        <!-- Miktar + Kaynak para -->
        <div class="flex gap-2">
          <input
            v-model="amount"
            type="number"
            inputmode="decimal"
            class="flex-1 px-3 py-2 rounded-lg border"
            placeholder="Miktar"
          />

          <select
            v-model="from"
            class="w-28 px-3 py-2 rounded-lg border bg-white"
          >
            <option v-for="c in currencies" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </div>

        <!-- ok -->
        <div class="text-center text-gray-400">→</div>

        <!-- Hedef para + sonuç -->
        <div class="flex gap-2 items-center">
          <select
            v-model="to"
            class="w-28 px-3 py-2 rounded-lg border bg-white"
          >
            <option v-for="c in currencies" :key="c" :value="c">
              {{ c }}
            </option>
          </select>

          <div class="flex-1 px-3 py-2 rounded-lg border bg-gray-50 text-right">
            <span v-if="converted !== null">
              {{ fmt(converted) }} {{ to }}
            </span>
            <span v-else class="text-gray-400">Sonuç burada görünecek</span>
          </div>
        </div>
      </div>

      <p class="mt-3 text-xs text-gray-500">
        Not: Hesaplama USD tabanlı kur verisiyle yapılır. Sonuçlar yaklaşık
        değerlerdir.
      </p>
    </div>

    <!-- Altın & Gümüş: fiyat özetleri -->
    <div
      v-if="hasMetals && usdTry"
      class="bg-white border rounded-2xl p-6 mb-8"
    >
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4"
      >
        <div>
          <h2 class="text-lg font-semibold">
            Altın &amp; Gümüş Fiyatı (Yaklaşık)
          </h2>
          <p class="text-gray-600 text-sm mt-1">
            MetalpriceAPI’den gelen XAU (ons altın) verisi, güncel USD/TRY kuru
            ile TL’ye çevrilir. İşçilik ve makas farkı dahil değildir.
          </p>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-gray-50 rounded-xl border p-4">
          <div class="text-xs text-gray-500 uppercase tracking-wide">
            Ons Altın (XAU)
          </div>
          <div class="mt-2 text-lg font-semibold">
            1 ons ≈ {{ fmtMoney(ounceGoldTry) }} TL
          </div>
          <div class="mt-1 text-sm text-gray-600">
            1 ons ≈ {{ fmt(OUNCE_IN_GRAM) }} gram saf altın
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl border p-4">
          <div class="text-xs text-gray-500 uppercase tracking-wide">
            Gram Altın (24 ayar)
          </div>
          <div class="mt-2 text-lg font-semibold">
            1 gram ≈ {{ fmtMoney(gramGoldTry) }} TL
          </div>
          <div class="mt-1 text-sm text-gray-600">
            Ons altın fiyatından yaklaşık hesaplanır.
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl border p-4">
          <div class="text-xs text-gray-500 uppercase tracking-wide">
            Çeyrek / Yarım / Tam
          </div>
          <div class="mt-2 space-y-1 text-sm text-gray-700">
            <div>Çeyrek ≈ {{ fmtMoney(quarterGoldTry) }} TL</div>
            <div>Yarım ≈ {{ fmtMoney(halfGoldTry) }} TL</div>
            <div>Tam ≈ {{ fmtMoney(fullGoldTry) }} TL</div>
          </div>
          <div class="mt-1 text-xs text-gray-500">
            Hesaplamalarda yaklaşık gram karşılıkları kullanılır (işçilik yok).
          </div>
        </div>
      </div>
    </div>

    <!-- Altın Hesaplayıcı -->
    <div v-if="hasMetals && usdTry" class="bg-white border rounded-2xl p-6">
      <h2 class="text-lg font-semibold mb-3">
        Altın Hesaplayıcı – Gram, Çeyrek, Ons → TL
      </h2>

      <div class="grid md:grid-cols-[2fr_3fr] gap-4 items-center">
        <!-- giriş -->
        <div class="flex gap-2">
          <input
            v-model="goldAmount"
            type="number"
            inputmode="decimal"
            class="flex-1 px-3 py-2 rounded-lg border"
            placeholder="Miktar"
          />

          <select
            v-model="goldUnit"
            class="w-32 px-3 py-2 rounded-lg border bg-white"
          >
            <option v-for="u in goldUnits" :key="u.value" :value="u.value">
              {{ u.label }}
            </option>
          </select>
        </div>

        <!-- sonuç -->
        <div
          class="px-4 py-3 rounded-xl border bg-gray-50 text-right text-lg font-semibold"
        >
          <span v-if="goldResultTry !== null">
            ≈ {{ fmtMoney(goldResultTry) }} TL
          </span>
          <span v-else class="text-gray-400 text-sm">
            Altın miktarını gir, yaklaşık TL karşılığı burada görünsün.
          </span>
        </div>
      </div>

      <p class="mt-3 text-xs text-gray-500">
        Not: Hesaplama ons altın (XAU) fiyatından türetilir, bankalar ve
        kuyumcuların alış / satış makası ve işçilik dahil değildir.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { fetchRates } from "../services/ratesClient";
import { fetchMetals } from "../services/metalsClient";
import { useSeo } from "../composables/useSeo";

/* ---------------- SEO ---------------- */
const baseUrl = "https://hesaplabs.com";
const pageUrl = computed(() => `${baseUrl}/piyasalar`);

useSeo({
  title: "Canlı Döviz Kurları, Altın Fiyatı ve Kur Çevirici | Hesaplabs",
  description:
    "USD, EUR, GBP ve gram/ons altın fiyatlarını canlı olarak takip et. Döviz kur çevirici ve altın hesaplayıcı ile hızlıca TL karşılığını öğren.",
  canonical: pageUrl,
  ogUrl: pageUrl,
  ogType: "website",
  ogSiteName: "Hesaplabs",
});

/* ---------------- Döviz verisi ---------------- */
const loading = ref(true);
const error = ref("");
const data = ref(null);

const amount = ref("1000");
const from = ref("TRY");
const to = ref("USD");
const currencies = ["TRY", "USD", "EUR", "GBP"];

onMounted(() => {
  loadRates();
  loadMetals();
});

async function loadRates() {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetchRates({
      base: "USD",
      symbols: currencies.filter((c) => c !== "USD"),
    });
    data.value = res;
  } catch (e) {
    console.error(e);
    error.value = e?.message || "Bilinmeyen hata.";
  } finally {
    loading.value = false;
  }
}

const hasData = computed(() => !!data.value && !!data.value.rates);

const lastUpdate = computed(() => {
  if (!data.value?.date) return "";
  return data.value.date;
});

const usdTry = computed(() => data.value?.rates?.TRY ?? null);

const eurUsdRaw = computed(() => data.value?.rates?.EUR ?? null);

const eurUsd = computed(() => {
  const r = eurUsdRaw.value;
  if (!r) return null;
  // 1 USD = r EUR  =>  1 EUR = 1 / r USD
  return 1 / r;
});

const eurTry = computed(() => {
  const r = data.value?.rates;
  if (!r?.TRY || !r?.EUR) return null;
  return r.TRY / r.EUR;
});

function convertInternal(rawAmount, fromC, toC) {
  if (!data.value?.rates) return null;

  const base = data.value.base || "USD";
  const rates = data.value.rates;

  const val = Number(String(rawAmount).replace(",", "."));
  if (!Number.isFinite(val)) return null;
  if (fromC === toC) return val;

  let inBase;
  if (fromC === base) {
    inBase = val;
  } else {
    const rateFrom = rates[fromC];
    if (!rateFrom) return null;
    inBase = val / rateFrom;
  }

  if (toC === base) return inBase;

  const rateTo = rates[toC];
  if (!rateTo) return null;

  return inBase * rateTo;
}

const converted = computed(() => {
  if (!amount.value || !hasData.value) return null;
  return convertInternal(amount.value, from.value, to.value);
});

/* ---------------- Altın / Metal verisi ---------------- */
const metalsLoading = ref(false);
const metalsError = ref("");
const metalsData = ref(null);

async function loadMetals() {
  metalsLoading.value = true;
  metalsError.value = "";
  try {
    const res = await fetchMetals({
      base: "USD",
      currencies: ["XAU", "XAG"],
    });
    metalsData.value = res;
  } catch (e) {
    console.error(e);
    metalsError.value = e?.message || "Altın verisi alınamadı.";
  } finally {
    metalsLoading.value = false;
  }
}

const hasMetals = computed(
  () => !!metalsData.value && !!metalsData.value.rates?.XAU
);

const metalsLastUpdate = computed(() => {
  // MetalpriceAPI response formatına göre uygula;
  // çoğu zaman "timestamp" veya "date" alanı oluyor.
  // Yoksa boş string dönüyoruz.
  if (!metalsData.value) return "";
  return metalsData.value.date || "";
});

// 1 ons = 31.1034768 gram
const OUNCE_IN_GRAM = 31.1034768;

const ounceGoldUsd = computed(() => metalsData.value?.rates?.XAU ?? null);

const ounceGoldTry = computed(() => {
  if (!ounceGoldUsd.value || !usdTry.value) return null;
  return ounceGoldUsd.value * usdTry.value;
});

const gramGoldTry = computed(() => {
  if (!ounceGoldTry.value) return null;
  return ounceGoldTry.value / OUNCE_IN_GRAM;
});

// Yaklaşık gram karşılıkları (saf altın)
const QUARTER_GRAM = 1.75;
const HALF_GRAM = 3.5;
const FULL_GRAM = 7.0;

const quarterGoldTry = computed(() =>
  gramGoldTry.value ? gramGoldTry.value * QUARTER_GRAM : null
);
const halfGoldTry = computed(() =>
  gramGoldTry.value ? gramGoldTry.value * HALF_GRAM : null
);
const fullGoldTry = computed(() =>
  gramGoldTry.value ? gramGoldTry.value * FULL_GRAM : null
);

/* ---------------- Altın Hesaplayıcı ---------------- */
const goldAmount = ref("1");
const goldUnit = ref("gram");

const goldUnits = [
  { value: "gram", label: "Gram altın" },
  { value: "ceyrek", label: "Çeyrek altın" },
  { value: "yarim", label: "Yarım altın" },
  { value: "tam", label: "Tam altın" },
  { value: "ons", label: "Ons altın" },
];

function unitToGram(u) {
  switch (u) {
    case "gram":
      return 1;
    case "ceyrek":
      return QUARTER_GRAM;
    case "yarim":
      return HALF_GRAM;
    case "tam":
      return FULL_GRAM;
    case "ons":
      return OUNCE_IN_GRAM;
    default:
      return 1;
  }
}

const goldResultTry = computed(() => {
  if (!goldAmount.value || !gramGoldTry.value) return null;
  const val = Number(String(goldAmount.value).replace(",", "."));
  if (!Number.isFinite(val)) return null;
  const grams = val * unitToGram(goldUnit.value);
  return grams * gramGoldTry.value;
});

/* ---------------- Formatlayıcılar ---------------- */
function fmt(v) {
  if (v == null) return "-";
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 4,
  }).format(v);
}

function fmtMoney(v) {
  if (v == null) return "-";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(v);
}
</script>
