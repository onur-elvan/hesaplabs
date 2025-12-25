<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <div class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <!-- ✅ Ana sayfada 1 tane H1 -->
        <h1 class="text-3xl font-bold">Hesaplayıcılar</h1>
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

    <!-- ✅ Favoriler (accordion) -->
    <div v-if="!q && favorites.length" class="mt-8">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold">Favoriler</h2>
          <button
            type="button"
            class="w-7 h-7 flex items-center justify-center rounded-full border bg-white text-xs hover:shadow"
            @click="toggleSection('favorites')"
            :aria-label="
              sectionsOpen.favorites ? 'Favorileri gizle' : 'Favorileri göster'
            "
          >
            <span v-if="sectionsOpen.favorites">▲</span>
            <span v-else>▼</span>
          </button>
        </div>

        <button
          class="text-sm text-gray-500 hover:text-red-600"
          @click="clearFavorites"
          title="Favorileri temizle"
        >
          Favorileri temizle
        </button>
      </div>

      <transition name="fade">
        <div
          v-if="sectionsOpen.favorites"
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3"
        >
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
      </transition>
    </div>

    <!-- ✅ Son Kullanılanlar (accordion) -->
    <div v-if="!q && recent.length" class="mt-8">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold">
            Son Kullanılanlar
            <span class="text-xs text-gray-500 font-normal">(son 3)</span>
          </h2>

          <button
            type="button"
            class="w-7 h-7 flex items-center justify-center rounded-full border bg-white text-xs hover:shadow"
            @click="toggleSection('recent')"
            :aria-label="
              sectionsOpen.recent
                ? 'Son kullanılanları gizle'
                : 'Son kullanılanları göster'
            "
          >
            <span v-if="sectionsOpen.recent">▲</span>
            <span v-else>▼</span>
          </button>
        </div>

        <button
          class="text-sm text-gray-500 hover:text-red-600"
          @click="clearRecent"
          title="Son kullanılanları temizle"
        >
          Son kullanılanları temizle
        </button>
      </div>

      <transition name="fade">
        <div
          v-if="sectionsOpen.recent"
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3"
        >
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
      </transition>
    </div>

    <!-- ✅ Öne Çıkanlar: sadece SON EKLENENLER (accordion) -->
    <section v-if="!q && latest.length" class="mt-10">
      <div class="flex items-end justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-2">
          <div class="text-left">
            <h2 class="text-2xl font-bold">Son Eklenenler</h2>
          </div>
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-full border bg-white text-xs hover:shadow mt-1"
            @click="toggleSection('latest')"
            :aria-label="
              sectionsOpen.latest
                ? 'Öne çıkanları gizle'
                : 'Öne çıkanları göster'
            "
          >
            <span v-if="sectionsOpen.latest">▲</span>
            <span v-else>▼</span>
          </button>
        </div>
      </div>

      <transition name="fade">
        <div
          v-if="sectionsOpen.latest"
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
        >
          <RouterLink
            v-for="c in latest"
            :key="c.id"
            :to="`/c/${c.id}`"
            class="bg-white rounded-xl border hover:shadow p-5 transition"
          >
            <div class="text-sm text-gray-500">{{ c.category }}</div>
            <div class="mt-1 text-lg font-semibold">{{ c.title }}</div>
            <div class="mt-2 text-gray-600 text-sm">{{ c.description }}</div>

            <div v-if="c.createdAt" class="mt-3 text-xs text-gray-400">
              Eklenme: {{ c.createdAt }}
            </div>
          </RouterLink>
        </div>
      </transition>
    </section>
    <hr class="mt-10 border-gray-200" />

    <!-- ✅ Popüler Hesaplamalar (GLOBAL kullanım sayısına göre) -->
    <section v-if="!q && popular.length" class="mt-10">
      <div class="flex items-end justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold">Popüler Hesaplamalar</h2>

          <!-- 🔹 Mobilde aç/kapa; desktop'ta her zaman açık -->
          <button
            v-if="isMobile"
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-full border bg-white text-xs hover:shadow"
            @click="mobilePopularOpen = !mobilePopularOpen"
            :aria-label="
              mobilePopularOpen
                ? 'Popüler hesaplamaları gizle'
                : 'Popüler hesaplamaları göster'
            "
          >
            <span v-if="mobilePopularOpen">▲</span>
            <span v-else>▼</span>
          </button>
        </div>

        <div class="flex items-center gap-3 text-xs text-gray-500">
          <span>Global kullanım istatistiklerine göre listelenir.</span>
        </div>
      </div>

      <transition name="fade">
        <div
          v-if="!isMobile || mobilePopularOpen"
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
        >
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
      </transition>

      <div
        v-if="!isMobile || mobilePopularOpen"
        class="mt-3 text-xs text-gray-500"
      >
        <span v-if="isPopularityLoading"
          >Global istatistikler yükleniyor...</span
        >
        <span v-else-if="!hasRealPopularity">
          Şu an gösterilen liste, varsayılan popüler hesaplamalardan oluşuyor.
        </span>
      </div>
    </section>
    <hr class="mt-10 border-gray-200" />

    <!-- Filtreler -->
    <div class="mt-10">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-lg font-semibold">Filtrele</h2>
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
import {
  computed,
  ref,
  onMounted,
  watch,
  nextTick,
  reactive,
  onUnmounted,
} from "vue";
import {
  calculators,
  getRecent,
  getFavorites,
  clearFavorites as clearFavoritesRegistry,
  clearRecent as clearRecentRegistry,
} from "../registry/calculators";
import { fetchGlobalPopularity } from "../services/popularityGlobal";

const recentIds = ref([]);
const favIds = ref([]);

// 🌍 Supabase'ten gelen global popülerlik map'i
// { "kdv": 123, "net-brut-maas": 87, ... }
const popMap = ref({});
const isPopularityLoading = ref(false);

// responsive için
const isMobile = ref(false);
const mobilePopularOpen = ref(false);

// accordion state'leri (başlangıçta hepsi kapalı)
const sectionsOpen = reactive({
  favorites: false,
  recent: false,
  latest: false,
});

function updateIsMobile() {
  if (typeof window === "undefined") return;
  isMobile.value = window.innerWidth < 768;
}

function toggleSection(key) {
  if (Object.prototype.hasOwnProperty.call(sectionsOpen, key)) {
    sectionsOpen[key] = !sectionsOpen[key];
  }
}

onMounted(() => {
  updateIsMobile();
  window.addEventListener("resize", updateIsMobile);

  recentIds.value = getRecent();
  favIds.value = getFavorites();
  loadGlobalPopularity();
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updateIsMobile);
  }
});

async function loadGlobalPopularity() {
  isPopularityLoading.value = true;
  try {
    const map = await fetchGlobalPopularity();
    popMap.value = map || {};
  } catch (err) {
    console.warn("[home] global popularity error", err);
  } finally {
    isPopularityLoading.value = false;
  }
}

function findById(id) {
  return calculators.find((c) => c.id === id) || null;
}

const recent = computed(() =>
  recentIds.value.map(findById).filter(Boolean).slice(0, 3)
);

const favorites = computed(() => favIds.value.map(findById).filter(Boolean));

/**
 * Son eklenenler:
 * createdAt varsa ona göre, yoksa array sonundan.
 */
const latest = computed(() => {
  const withDate = calculators
    .filter((c) => c.createdAt)
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  if (withDate.length) return withDate.slice(0, 9);

  // fallback: array'in sonundan al
  return calculators.slice().reverse().slice(0, 9);
});

/**
 * Popüler hesaplar:
 * - Supabase global view_count'a göre
 * - Hiç veri yoksa sabit id listesi (seed)
 * - Maks 6 tane
 */
const popularitySeedIds = [
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

const hasRealPopularity = computed(() => {
  const m = popMap.value || {};
  return Object.values(m).some((v) => Number(v) > 0);
});

const popular = computed(() => {
  const map = popMap.value || {};

  if (hasRealPopularity.value) {
    // Supabase verisine göre sırala (maks 6)
    return calculators
      .slice()
      .map((c) => ({ c, count: Number(map[c.id] || 0) }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map((x) => x.c);
  }

  // veri yoksa seed list (maks 6)
  return popularitySeedIds.map(findById).filter(Boolean).slice(0, 6);
});

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
