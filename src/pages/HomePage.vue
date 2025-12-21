<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <div class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h2 class="text-3xl font-bold">Hesaplayıcılar</h2>
        <p class="text-gray-600 mt-2">İstediğini seç, hemen hesapla.</p>
      </div>

      <!-- Search -->
      <div class="w-full sm:w-96">
        <label class="sr-only">Ara</label>

        <div
          class="relative bg-white border rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400 transition"
        >
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"
          >
            🔎
          </div>

          <input
            ref="searchRef"
            v-model="q"
            class="w-full pl-10 pr-10 py-3 rounded-xl outline-none bg-transparent"
            placeholder="Ara (örn: yüzde, kdv, faiz)"
            inputmode="search"
            autocomplete="off"
          />

          <button
            v-if="q"
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700"
            @click="clearSearch"
            aria-label="Aramayı temizle"
            title="Temizle"
          >
            ✕
          </button>
        </div>

        <div v-if="q" class="mt-2 text-xs text-gray-500">
          “{{ q }}” için sonuçlar aşağıda listeleniyor.
          <button
            class="underline ml-1 hover:text-blue-600"
            @click="scrollToResults"
          >
            Sonuçlara git
          </button>
        </div>
      </div>
    </div>

    <!-- Favoriler (arama yokken göster) -->
    <div v-if="!q && favorites.length" class="mt-8">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-lg font-semibold">Favoriler</h3>

        <button
          class="text-sm text-gray-500 hover:text-red-600"
          @click="clearFavorites"
          title="Favorileri temizle"
        >
          Favorileri temizle
        </button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        <RouterLink
          v-for="c in favorites"
          :key="c.id"
          :to="`/c/${c.id}`"
          class="bg-white rounded-xl border hover:shadow p-5 transition"
        >
          <div class="text-sm text-gray-500">{{ c.category }}</div>
          <div class="mt-1 text-lg font-semibold">{{ c.title }}</div>
          <div class="mt-2 text-gray-600 text-sm">{{ c.description }}</div>
        </RouterLink>
      </div>
    </div>

    <!-- Son Kullanılanlar (arama yokken göster) -->
    <div v-if="!q && recent.length" class="mt-8">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-lg font-semibold">
          Son Kullanılanlar
          <span class="text-xs text-gray-500 font-normal">(son 3)</span>
        </h3>

        <button
          class="text-sm text-gray-500 hover:text-red-600"
          @click="clearRecent"
          title="Son kullanılanları temizle"
        >
          Son kullanılanları temizle
        </button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        <RouterLink
          v-for="c in recent"
          :key="c.id"
          :to="`/c/${c.id}`"
          class="bg-white rounded-xl border hover:shadow p-4 transition"
        >
          <div class="text-sm text-gray-500">{{ c.category }}</div>
          <div class="mt-1 text-lg font-semibold">{{ c.title }}</div>
          <div class="mt-2 text-gray-600 text-sm">{{ c.description }}</div>
        </RouterLink>
      </div>
    </div>

    <!-- ✅ Popüler Hesaplamalar (arama yokken göster) -->
    <section v-if="!q && popular.length" class="mt-10">
      <div class="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 class="text-2xl font-bold">Popüler Hesaplamalar</h2>
          <p class="text-sm text-gray-600 mt-1">
            En çok aranan araçlara hızlıca ulaş.
          </p>
        </div>

        <span class="text-xs text-gray-500">
          (Google için de keşfi hızlandırır ✅)
        </span>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <RouterLink
          v-for="c in popular"
          :key="c.id"
          :to="`/c/${c.id}`"
          class="bg-white rounded-xl border hover:shadow p-5 transition"
        >
          <div class="text-sm text-gray-500">{{ c.category }}</div>
          <div class="mt-1 text-lg font-semibold">{{ c.title }}</div>
          <div class="mt-2 text-gray-600 text-sm">{{ c.description }}</div>
        </RouterLink>
      </div>
    </section>

    <!-- Filtreler -->
    <div class="mt-10">
      <div class="flex items-center justify-between gap-4">
        <h3 class="text-lg font-semibold">Filtrele</h3>
        <button
          v-if="selectedCategory !== 'Tümü'"
          class="text-sm text-gray-500 hover:text-blue-600"
          @click="selectedCategory = 'Tümü'"
        >
          Temizle
        </button>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          class="px-3 py-2 rounded-full border text-sm transition"
          :class="
            selectedCategory === cat
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white hover:shadow'
          "
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Tüm hesaplayıcılar listesi (scroll hedefi) -->
    <div ref="resultsRef" class="mt-8">
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink
          v-for="c in filtered"
          :key="c.id"
          :to="`/c/${c.id}`"
          class="bg-white rounded-xl border hover:shadow p-5 transition"
        >
          <div class="text-sm text-gray-500">{{ c.category }}</div>
          <div class="mt-1 text-lg font-semibold">{{ c.title }}</div>
          <div class="mt-2 text-gray-600 text-sm">{{ c.description }}</div>
        </RouterLink>
      </div>

      <div v-if="q && filtered.length === 0" class="mt-6 text-sm text-gray-500">
        “{{ q }}” için sonuç bulunamadı.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick } from "vue";
import {
  calculators,
  getRecent,
  getFavorites,
  clearFavorites as clearFavoritesRegistry,
  clearRecent as clearRecentRegistry,
} from "../registry/calculators";

const recentIds = ref([]);
const favIds = ref([]);

onMounted(() => {
  recentIds.value = getRecent();
  favIds.value = getFavorites();
});

function findById(id) {
  return calculators.find((c) => c.id === id) || null;
}

const recent = computed(() =>
  recentIds.value.map(findById).filter(Boolean).slice(0, 3)
);

const favorites = computed(() => favIds.value.map(findById).filter(Boolean));

/**
 * ✅ Popüler hesaplar (SEO + UX)
 * İd’leri burada sabit tutuyoruz.
 */
const popularIds = [
  "net-brut-maas",
  "kdv",
  "faiz-basit",
  "faiz-bilesik",
  "kar-marj",
  "e-ticaret-karlilik",
  "ebob-ekok",
  "birim-donusturucu",
  "bmi",
  "bel-kalca-orani",
  "damga",
  "lineer-sistem-cozucu",
];

const popular = computed(() =>
  popularIds.map(findById).filter(Boolean).slice(0, 12)
);

const q = ref("");
const selectedCategory = ref("Tümü");

const searchRef = ref(null);
const resultsRef = ref(null);

function scrollToResults() {
  if (!resultsRef.value) return;
  resultsRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearSearch() {
  q.value = "";
  nextTick(() => searchRef.value?.focus());
}

// Arama yazınca otomatik aşağı kaydır
watch(
  () => q.value,
  async (val) => {
    if (!val) return;
    await nextTick();
    scrollToResults();
  }
);

const filtered = computed(() => {
  let list = calculators;

  if (selectedCategory.value !== "Tümü") {
    list = list.filter((c) => c.category === selectedCategory.value);
  }

  const query = q.value.trim().toLowerCase();
  if (query) {
    list = list.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const desc = (c.description || "").toLowerCase();
      const cat = (c.category || "").toLowerCase();
      return (
        title.includes(query) || desc.includes(query) || cat.includes(query)
      );
    });
  }

  return list;
});

const categories = computed(() => {
  const set = new Set(calculators.map((c) => c.category));
  return ["Tümü", ...Array.from(set)];
});

function clearFavorites() {
  const ok = confirm("Tüm favorileri silmek istiyor musun?");
  if (!ok) return;
  favIds.value = clearFavoritesRegistry();
}

function clearRecent() {
  const ok = confirm("Son kullanılanları temizlemek istiyor musun?");
  if (!ok) return;
  recentIds.value = clearRecentRegistry();
}
</script>
