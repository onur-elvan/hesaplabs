<!-- src/tools/UuidTool.vue -->
<template>
  <main class="space-y-10">
    <!-- Başlık ve kısa açıklama -->
    <section>
      <h1 class="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
        UUID Generator
      </h1>
      <p class="text-slate-600 text-sm sm:text-base max-w-2xl">
        Tek tıkla benzersiz UUID’ler (Universally Unique Identifier) üretin.
        Versiyon 4 rastgele UUID’ler, çoğu uygulama için fazlasıyla yeterlidir.
      </p>
    </section>

    <!-- Ayarlar + Üretim -->
    <section
      class="grid gap-6 lg:grid-cols-[minmax(0,260px),minmax(0,1fr)] items-stretch"
    >
      <!-- Sol: Ayarlar -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <h2 class="text-base font-semibold text-slate-900 mb-3">
          Üretim Ayarları
        </h2>

        <div class="space-y-4 text-sm">
          <!-- Adet -->
          <div>
            <label class="block text-slate-700 mb-1 font-medium">
              Kaç adet UUID üretilecek?
            </label>
            <input
              v-model.number="count"
              type="number"
              min="1"
              max="100"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p class="mt-1 text-xs text-slate-500">
              1–100 arası değer girebilirsiniz. Varsayılan: 5.
            </p>
          </div>

          <!-- Versiyon -->
          <div>
            <label class="block text-slate-700 mb-1 font-medium">
              UUID versiyonu
            </label>
            <select
              v-model="version"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="v4">v4 – Rastgele UUID</option>
              <option value="v1">v1 – Zaman tabanlı UUID (yaklaşık)</option>
            </select>
            <p class="mt-1 text-xs text-slate-500">
              En çok kullanılan versiyon <strong>v4</strong>&apos;tür.
            </p>
          </div>

          <!-- Biçim seçenekleri -->
          <div>
            <span class="block text-slate-700 mb-1 font-medium">
              Biçim seçenekleri
            </span>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm text-slate-700">
                <input v-model="asUppercase" type="checkbox" class="rounded" />
                Büyük harf kullan (ör. 550E8400-E29B-41D4-A716-...)
              </label>

              <label class="flex items-center gap-2 text-sm text-slate-700">
                <input v-model="withBraces" type="checkbox" class="rounded" />
                Süslü parantez ekle (ör. {"{"}uuid{"}"})
              </label>

              <label class="flex items-center gap-2 text-sm text-slate-700">
                <input v-model="withHyphens" type="checkbox" class="rounded" />
                Tire kullan (standart biçim – kapatırsan düz 32 karakter olur)
              </label>
            </div>
          </div>
        </div>

        <button
          type="button"
          @click="generate"
          class="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          UUID üret
        </button>

        <p class="mt-2 text-xs text-slate-500">
          Bu araç tamamen tarayıcı içinde çalışır, üretilen değerler sunucuya
          gönderilmez.
        </p>
      </div>

      <!-- Sağ: Sonuçlar -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <div class="flex items-center justify-between gap-2 mb-3">
          <h2 class="text-base font-semibold text-slate-900">
            Üretilen UUID&apos;ler
          </h2>
          <button
            v-if="uuids.length"
            type="button"
            @click="copyAll"
            class="text-xs px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Tümünü kopyala
          </button>
        </div>

        <div
          v-if="uuids.length"
          class="space-y-2 overflow-y-auto text-sm flex-1"
        >
          <div
            v-for="(id, index) in uuids"
            :key="index"
            class="flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1.5"
          >
            <span class="text-[11px] text-slate-400 w-6">{{ index + 1 }}.</span>
            <span class="font-mono text-xs sm:text-sm text-slate-800 break-all">
              {{ id }}
            </span>
            <button
              type="button"
              @click="copyOne(id, index)"
              class="ml-auto text-xs px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <span v-if="lastCopiedIndex === index">Kopyalandı</span>
              <span v-else>Kopyala</span>
            </button>
          </div>
        </div>

        <p v-else class="text-sm text-slate-500">
          Henüz UUID üretilmedi. Ayarları yapıp <strong>“UUID üret”</strong>
          butonuna basın.
        </p>
      </div>
    </section>

    <!-- Açıklama -->
    <section class="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5">
      <h2 class="text-base font-semibold text-slate-900 mb-2">
        UUID Nedir? Ne İşe Yarar?
      </h2>
      <div class="space-y-2 text-sm text-slate-700 leading-relaxed">
        <p>
          UUID (Universally Unique Identifier), 128 bitlik, pratikte
          eşleşmeyecek kadar düşük çakışma ihtimaline sahip bir kimliktir.
          Veritabanı kayıtlarında, dosya adlarında, oturum anahtarlarında, kupon
          kodlarında ve daha pek çok yerde benzersiz kimlik üretmek için
          kullanılır.
        </p>
        <p>En sık kullanılan biçim şöyle görünür:</p>
        <pre
          class="bg-slate-900 text-slate-50 text-xs sm:text-sm rounded-md px-3 py-2 overflow-x-auto"
        >
xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</pre
        >
        <p>
          Buradaki <code>4</code> karakteri UUID&apos;nin
          <strong> versiyon 4</strong> olduğunu gösterir. <code>y</code>{" "}
          karakteri ise varyant bilgisini temsil eder. Geri kalan tüm
          karakterler rastgele (veya zaman tabanlı) değerlerle doldurulur.
        </p>
        <p>
          Versiyon 4 UUID, JavaScript tarafında
          <code>crypto.getRandomValues</code> kullanılarak kriptografik olarak
          güçlü rastgele değerlerle üretilebilir. Bu araçta da bu yöntem tercih
          edilmiştir.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";

const version = ref("v4");
const count = ref(5);
const asUppercase = ref(false);
const withBraces = ref(false);
const withHyphens = ref(true);

const uuids = ref([]);
const lastCopiedIndex = ref(null);

function generateV4Uuid() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40; // versiyon 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant

  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

  if (!withHyphens.value) {
    return hex;
  }

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

// v1 burada gerçek saat/MAC kullanmıyor; sade bir “zaman tabanlı” örnek
function generateV1LikeUuid() {
  const now = Date.now().toString(16).padStart(12, "0");
  const rand = generateV4Uuid().replace(/-/g, "").slice(-20);
  const raw = now + rand;
  const withVersion = raw.slice(0, 12) + "1" + raw.slice(13); // versiyon 1

  if (!withHyphens.value) return withVersion;

  return [
    withVersion.slice(0, 8),
    withVersion.slice(8, 12),
    withVersion.slice(12, 16),
    withVersion.slice(16, 20),
    withVersion.slice(20),
  ].join("-");
}

function formatUuid(u) {
  let out = u;
  if (withBraces.value) out = `{${out}}`;
  if (asUppercase.value) out = out.toUpperCase();
  return out;
}

function generate() {
  const n = Math.min(Math.max(count.value || 1, 1), 100);

  const list = [];
  for (let i = 0; i < n; i++) {
    const raw =
      version.value === "v1" ? generateV1LikeUuid() : generateV4Uuid();
    list.push(formatUuid(raw));
  }
  uuids.value = list;
  lastCopiedIndex.value = null;
}

async function copyOne(uuid, index) {
  try {
    await navigator.clipboard.writeText(uuid);
    lastCopiedIndex.value = index;
    setTimeout(() => {
      if (lastCopiedIndex.value === index) lastCopiedIndex.value = null;
    }, 1500);
  } catch {
    alert("Kopyalama sırasında bir hata oluştu.");
  }
}

async function copyAll() {
  if (!uuids.value.length) return;
  try {
    await navigator.clipboard.writeText(uuids.value.join("\n"));
    lastCopiedIndex.value = -1;
    setTimeout(() => {
      if (lastCopiedIndex.value === -1) lastCopiedIndex.value = null;
    }, 1500);
  } catch {
    alert("Tümünü kopyalarken bir hata oluştu.");
  }
}

onMounted(() => {
  generate();
});
</script>
