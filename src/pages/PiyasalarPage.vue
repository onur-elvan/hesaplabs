<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <!-- Başlık -->
    <div class="bg-white border rounded-2xl p-6 mb-6">
      <h1 class="text-2xl font-bold">Piyasalar – Canlı Kur ve Çevirici</h1>
      <p class="text-gray-600 mt-2">
        Veriler ExchangeRate-API üzerinden çekilir. Değerler bilgilendirme
        amaçlıdır.
      </p>

      <div class="mt-3 text-sm text-gray-500 flex flex-wrap gap-3">
        <div v-if="lastUpdate">
          Son güncelleme:
          <span class="font-medium">{{ lastUpdate }}</span>
        </div>
        <div v-if="loading">Kurlar yükleniyor...</div>
        <div v-if="error" class="text-red-600">Hata: {{ error }}</div>
      </div>
    </div>

    <!-- Özet kartları -->
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
    <div class="bg-white border rounded-2xl p-6">
      <h2 class="text-lg font-semibold mb-3">Kur Çevirici</h2>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { fetchRates } from "../services/ratesClient";

const loading = ref(true);
const error = ref("");
const data = ref(null);

// Çevirici durumu
const amount = ref("1000");
const from = ref("TRY");
const to = ref("USD");
const currencies = ["TRY", "USD", "EUR", "GBP"];

// İlk yükleme
onMounted(loadRates);

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

// Kurları hesaplayan yardımcılar
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
  // 1 EUR = (TRY / EUR) TL
  return r.TRY / r.EUR;
});

// Genel dönüştürücü (base=USD varsayımıyla)
function convertInternal(rawAmount, fromC, toC) {
  if (!data.value?.rates) return null;

  const base = data.value.base || "USD";
  const rates = data.value.rates;

  const val = Number(String(rawAmount).replace(",", "."));
  if (!Number.isFinite(val)) return null;
  if (fromC === toC) return val;

  // 1) Kaynak parayı base'e çevir
  let inBase;
  if (fromC === base) {
    inBase = val;
  } else {
    const rateFrom = rates[fromC];
    if (!rateFrom) return null;
    // 1 base = rateFrom fromC  =>  1 fromC = 1 / rateFrom base
    inBase = val / rateFrom;
  }

  // 2) base'den hedefe çevir
  if (toC === base) return inBase;

  const rateTo = rates[toC];
  if (!rateTo) return null;

  // 1 base = rateTo toC
  return inBase * rateTo;
}

const converted = computed(() => {
  if (!amount.value || !hasData.value) return null;
  return convertInternal(amount.value, from.value, to.value);
});

// Basit formatlayıcı
function fmt(v) {
  if (v == null) return "-";
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 4,
  }).format(v);
}
</script>
