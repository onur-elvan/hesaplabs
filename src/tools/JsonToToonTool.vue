<template>
  <section class="space-y-6">
    <!-- Üst başlık + küçük açıklama -->
    <header class="space-y-2">
      <!-- Başlığı tamamen kaldır, sadece kısa açıklama bırak -->
      <p class="text-slate-600 text-sm sm:text-base mb-4">
        JSON verini TOON formatına dönüştür; aynı veriyi daha az token ile ifade
        ederek LLM isteklerinde tasarruf sağlayabilirsin.
      </p>
    </header>

    <!-- Ana grid -->
    <div class="grid lg:grid-cols-2 gap-5">
      <!-- JSON Input -->
      <div class="flex flex-col bg-white border rounded-xl shadow-sm">
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 class="font-semibold text-slate-900 text-sm sm:text-base">
              JSON Input
            </h3>
            <p class="text-[11px] text-slate-500">
              Geçerli bir JSON (nesne veya dizi) yapıştır.
            </p>
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              class="px-2.5 py-1.5 text-[11px] rounded-md border text-slate-700 bg-white hover:bg-slate-50"
              @click="loadExample"
            >
              Örnek yükle
            </button>
            <button
              type="button"
              class="px-2.5 py-1.5 text-[11px] rounded-md border text-slate-700 bg-white hover:bg-slate-50"
              @click="jsonInput = ''"
            >
              Temizle
            </button>
          </div>
        </div>

        <textarea
          v-model="jsonInput"
          class="flex-1 w-full min-h-[260px] lg:min-h-[380px] resize-y px-4 py-3 text-xs sm:text-sm font-mono border-0 rounded-b-xl focus:ring-0 focus:outline-none"
          placeholder='Örnek:
{
  "users": [
    { "id": 1, "name": "Ada", "active": true },
    { "id": 2, "name": "Can", "active": false }
  ]
}'
        ></textarea>
      </div>

      <!-- TOON Output -->
      <div class="flex flex-col bg-white border rounded-xl shadow-sm">
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 class="font-semibold text-slate-900 text-sm sm:text-base">
              TOON Output
            </h3>
            <p class="text-[11px] text-slate-500">
              Dönüştürülen TOON çıktısı burada görünecek.
            </p>
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              class="px-2.5 py-1.5 text-[11px] rounded-md border text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
              :disabled="!toonOutput"
              @click="copyToon"
            >
              {{ copied ? "Kopyalandı ✓" : "Kopyala" }}
            </button>
            <button
              type="button"
              class="px-2.5 py-1.5 text-[11px] rounded-md border text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
              :disabled="!toonOutput"
              @click="downloadToon"
            >
              İndir
            </button>
          </div>
        </div>

        <textarea
          v-model="toonOutput"
          readonly
          class="flex-1 w-full min-h-[260px] lg:min-h-[380px] resize-y px-4 py-3 text-xs sm:text-sm font-mono border-0 rounded-b-xl bg-slate-50 focus:ring-0 focus:outline-none"
          placeholder="Dönüşüm için önce üstteki alana geçerli bir JSON gir ve Convert butonuna tıkla."
        ></textarea>
      </div>
    </div>

    <!-- Hata / Bilgi satırı -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div class="flex items-center gap-2 text-xs sm:text-sm">
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          @click="convert"
        >
          Convert (Ctrl + Enter)
        </button>

        <p v-if="error" class="text-red-600 text-xs sm:text-sm">
          {{ error }}
        </p>
        <p v-else-if="toonOutput" class="text-emerald-700 text-xs sm:text-sm">
          JSON karakter: {{ jsonChars }} · TOON karakter: {{ toonChars }} ·
          Tasarruf: {{ savedPercent }}%
        </p>
      </div>

      <p class="text-[11px] text-slate-500 max-w-md">
        Tahmini tasarruf, karakter sayısına göre hesaplanır. Gerçek token
        tasarrufu, kullandığın modelin tokenizer’ına göre biraz değişebilir.
      </p>
    </div>

    <!-- Küçük not -->
    <div class="mt-3 text-[11px] sm:text-xs text-slate-500 leading-relaxed">
      <p>
        Bu araç; nesneleri, dizi içindeki nesne listelerini ve temel JSON
        tiplerini (string, number, boolean, null) TOON formatına dönüştürür. Tüm
        dönüşüm tarayıcında yapılır, verilerin sunucuya gönderilmez.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

/* ------------------ 상태 ------------------- */
const jsonInput = ref("");
const toonOutput = ref("");
const error = ref("");
const copied = ref(false);

/* ------------------ Yardımcılar ------------------- */
function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function stringifyPrimitive(v) {
  if (v === null) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : '"NaN"';

  if (typeof v === "string") {
    // Boşluk, virgül, iki nokta, köşeli ve süslü parantez içeriyorsa güvenli olmak için JSON.stringify
    if (/[\s,:{}\[\]"]/u.test(v)) {
      return JSON.stringify(v);
    }
    return v;
  }
  // Diğer türler için (undefined, function vs.) string’e çevir
  return JSON.stringify(v);
}

function objectArrayToToon(name, arr, indent) {
  const lines = [];
  const pad = "  ".repeat(indent);

  if (!arr.length) {
    lines.push(`${pad}${name}[0]{}`);
    return lines;
  }

  // Tüm key'leri birleştir (union)
  const keySet = new Set();
  for (const item of arr) {
    if (isPlainObject(item)) {
      Object.keys(item).forEach((k) => keySet.add(k));
    }
  }
  const keys = Array.from(keySet);
  const header = `${pad}${name}[${arr.length}]{${keys.join(",")}}:`;
  lines.push(header);

  for (const item of arr) {
    const row = keys.map((k) => stringifyPrimitive(item?.[k]));
    lines.push(`${pad} ${row.join(",")}`);
  }

  return lines;
}

function primitiveArrayToToon(name, arr, indent) {
  const lines = [];
  const pad = "  ".repeat(indent);

  lines.push(`${pad}${name}[${arr.length}]:`);
  for (const v of arr) {
    lines.push(`${pad} ${stringifyPrimitive(v)}`);
  }
  return lines;
}

function valueToToon(name, value, indent = 0) {
  const lines = [];
  const pad = "  ".repeat(indent);

  if (Array.isArray(value)) {
    const allObj = value.every((v) => isPlainObject(v));
    if (allObj) {
      lines.push(...objectArrayToToon(name, value, indent));
    } else {
      lines.push(...primitiveArrayToToon(name, value, indent));
    }
    return lines;
  }

  if (isPlainObject(value)) {
    if (name) {
      lines.push(`${pad}${name}:`);
      indent += 1;
    }
    const innerPad = "  ".repeat(indent);
    for (const [k, v] of Object.entries(value)) {
      if (isPlainObject(v) || Array.isArray(v)) {
        lines.push(...valueToToon(k, v, indent));
      } else {
        lines.push(`${innerPad}${k}: ${stringifyPrimitive(v)}`);
      }
    }
    return lines;
  }

  if (name) {
    lines.push(`${pad}${name}: ${stringifyPrimitive(value)}`);
  } else {
    lines.push(`${pad}${stringifyPrimitive(value)}`);
  }
  return lines;
}

function jsonToToon(root) {
  const lines = [];

  if (Array.isArray(root)) {
    // Kök dizi ise "items" adını ver
    const allObj = root.every((v) => isPlainObject(v));
    if (allObj) {
      lines.push(...objectArrayToToon("items", root, 0));
    } else {
      lines.push(...primitiveArrayToToon("items", root, 0));
    }
    return lines.join("\n");
  }

  if (isPlainObject(root)) {
    for (const [k, v] of Object.entries(root)) {
      lines.push(...valueToToon(k, v, 0));
      lines.push(""); // bölmek için boş satır
    }
    // Sondaki boş satırı temizle
    while (lines.length && lines[lines.length - 1] === "") {
      lines.pop();
    }
    return lines.join("\n");
  }

  // Diğer her şey için tek satır
  return stringifyPrimitive(root);
}

/* ------------------ Convert akışı ------------------- */
function convert() {
  error.value = "";
  toonOutput.value = "";

  if (!jsonInput.value.trim()) {
    error.value = "Lütfen geçerli bir JSON gir.";
    return;
  }

  try {
    const parsed = JSON.parse(jsonInput.value);
    toonOutput.value = jsonToToon(parsed);
  } catch (e) {
    error.value =
      "JSON parse hatası: " + (e instanceof Error ? e.message : String(e));
  }
}

/* ------------------ UI yardımcıları ------------------- */
function loadExample() {
  jsonInput.value = JSON.stringify(
    {
      user: { id: 123, name: "Ada", active: true },
      orders: [
        { id: 1, total: 199.9, currency: "TRY" },
        { id: 2, total: 89.5, currency: "TRY" },
      ],
      tags: ["premium", "beta-user"],
    },
    null,
    2
  );
}

async function copyToon() {
  if (!toonOutput.value) return;
  try {
    await navigator.clipboard.writeText(toonOutput.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch (e) {
    console.error("Kopyalama hatası:", e);
  }
}

function downloadToon() {
  if (!toonOutput.value) return;
  const blob = new Blob([toonOutput.value], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.toon.txt";
  a.click();
  URL.revokeObjectURL(url);
}

/* Klavye kısayolu: Ctrl+Enter ile convert */
function handleKey(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    convert();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKey);
});

/* ------------------ İstatistikler ------------------- */
const jsonChars = computed(() => jsonInput.value.length);
const toonChars = computed(() => toonOutput.value.length);
const savedPercent = computed(() => {
  if (!jsonChars.value || !toonChars.value) return 0;
  if (toonChars.value >= jsonChars.value) return 0;
  const diff = jsonChars.value - toonChars.value;
  return Math.round((diff / jsonChars.value) * 100);
});
</script>
