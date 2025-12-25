<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <!-- Header -->
    <div class="bg-white border rounded-2xl p-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-bold">JSON Formatter / Validator</h1>
          <p class="text-gray-600 mt-2">
            JSON metnini doğrula, beautify (pretty), minify, JSONPath ile ara,
            dosya yükle/indir. Tamamen tarayıcı içinde çalışır.
          </p>

          <div class="flex flex-wrap gap-2 mt-3">
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              ⚡ Hızlı
            </span>
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              🧠 Syntax Highlight
            </span>
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              🔒 Veri gitmez
            </span>
            <span class="px-3 py-1 rounded-full border text-sm bg-gray-50">
              📥 Upload / 📤 Download
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button class="btn" @click="loadSample">Örnek</button>
          <button class="btn" @click="clearAll">Temizle</button>
        </div>
      </div>
    </div>

    <!-- Main layout -->
    <div class="grid lg:grid-cols-[1fr_280px_1fr] gap-4 mt-6">
      <!-- LEFT: Input editor -->
      <div class="bg-white border rounded-2xl overflow-hidden">
        <div class="px-4 py-3 border-b flex items-center justify-between">
          <div class="font-semibold">Girdi</div>

          <div class="flex items-center gap-2">
            <button class="btn-sm" @click="pasteFromClipboard">Yapıştır</button>
            <button class="btn-sm" @click="copyInput" :disabled="!input">
              Kopyala
            </button>
          </div>
        </div>

        <div class="h-[680px]">
          <MonacoEditor
            v-model:value="input"
            language="json"
            theme="vs"
            :options="monacoOptions"
            @mount="onMountInput"
          />
        </div>

        <div
          class="px-4 py-3 border-t text-xs text-gray-500 flex items-center justify-between"
        >
          <div>
            {{ inputStats }}
          </div>
          <div v-if="error" class="text-red-600">
            ❌ {{ error.message }}
            <span v-if="error.line">
              (Satır {{ error.line }}, Sütun {{ error.col }})
            </span>
          </div>
          <div v-else-if="okMsg" class="text-green-700">✅ {{ okMsg }}</div>
        </div>
      </div>

      <!-- MIDDLE: Actions -->
      <div class="bg-white border rounded-2xl p-4">
        <div class="font-semibold mb-3">İşlemler</div>

        <button class="action" @click="validate">Validate</button>

        <div class="mt-2 grid grid-cols-2 gap-2">
          <select v-model="indentSel" class="select">
            <option value="2">2 space</option>
            <option value="4">4 space</option>
            <option value="tab">Tab</option>
          </select>

          <select
            v-model="sortKeys"
            class="select"
            title="Key’leri alfabetik sırala"
          >
            <option value="no">Sort: Kapalı</option>
            <option value="yes">Sort: Açık</option>
          </select>
        </div>

        <button class="action mt-2" @click="beautify">Format / Beautify</button>
        <button class="action mt-2" @click="minify">Minify / Compact</button>

        <div class="mt-4 border-t pt-4">
          <div class="font-semibold mb-2">JSONPath (basit)</div>
          <input
            v-model="pathQuery"
            class="input"
            placeholder="Örn: $.rules[0].maps[0].accountCode"
          />
          <button
            class="action mt-2"
            @click="runPath"
            :disabled="!pathQuery.trim()"
          >
            Sorgula
          </button>
          <div
            v-if="pathResult !== null"
            class="mt-2 text-xs text-gray-600 whitespace-pre-wrap"
          >
            <div class="font-semibold text-gray-800 mb-1">Sonuç</div>
            {{ pathResult }}
          </div>
        </div>

        <div class="mt-4 border-t pt-4">
          <div class="font-semibold mb-2">Dosya</div>
          <input
            type="file"
            accept=".json,application/json,text/plain"
            @change="onUpload"
            class="w-full text-sm"
          />
          <button
            class="action mt-2"
            @click="downloadOutput"
            :disabled="!output"
          >
            Download Output
          </button>
        </div>

        <div class="mt-4 border-t pt-4">
          <div class="font-semibold mb-2">Convert</div>
          <button class="action" @click="toJsonLines" :disabled="!input.trim()">
            JSON → JSONL
          </button>
          <button
            class="action mt-2"
            @click="fromJsonLines"
            :disabled="!input.trim()"
          >
            JSONL → JSON Array
          </button>
        </div>
      </div>

      <!-- RIGHT: Output editor -->
      <div class="bg-white border rounded-2xl overflow-hidden">
        <div class="px-4 py-3 border-b flex items-center justify-between">
          <div class="font-semibold">Çıktı</div>

          <div class="flex items-center gap-2">
            <button class="btn-sm" @click="copyOutput" :disabled="!output">
              Kopyala
            </button>
            <button class="btn-sm" @click="swap" :disabled="!output">
              ↔ Girdi/Çıktı
            </button>
          </div>
        </div>

        <div class="h-[680px]">
          <MonacoEditor
            v-model:value="output"
            language="json"
            theme="vs"
            :options="{ ...monacoOptions, readOnly: true }"
            @mount="onMountOutput"
          />
        </div>

        <div class="px-4 py-3 border-t text-xs text-gray-500">
          {{ outputStats }}
        </div>
      </div>
    </div>

    <!-- SEO info box -->
    <div
      class="mt-6 rounded-xl border bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed"
    >
      <h2 class="font-semibold text-gray-900 mb-2">Bilgi</h2>
      <ul class="list-disc pl-5 space-y-1">
        <li>JSON’da tek tırnak (') geçmez, çift tırnak (") kullanılır.</li>
        <li>Bu araç tarayıcı içinde çalışır; metnin sunucuya gönderilmez.</li>
        <li>
          Hata durumunda satır/sütun bilgisiyle hızlı düzeltme yapabilirsin.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useSeo } from "../composables/useSeo";
import MonacoEditor from "@guolao/vue-monaco-editor";

/** ---------------------------
 * State
 * -------------------------- */
const input = ref("");
const output = ref("");
const error = ref(null);
const okMsg = ref("");
const indentSel = ref("2"); // 2 | 4 | tab
const sortKeys = ref("no"); // no | yes
const pathQuery = ref("");
const pathResult = ref(null);

let inputEditor = null;
let outputEditor = null;

const monacoOptions = {
  fontSize: 13,
  minimap: { enabled: false },
  wordWrap: "on",
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  formatOnPaste: false,
  formatOnType: false,
};

/** ---------------------------
 * Helpers
 * -------------------------- */
function bytesOf(s) {
  return new Blob([String(s || "")]).size;
}

function parseErrorDetails(raw, msg) {
  const m = String(msg).match(/position\s+(\d+)/i);
  const pos = m ? Number(m[1]) : null;
  if (pos == null) return { message: String(msg) };

  const before = raw.slice(0, pos);
  const lines = before.split("\n");
  const line = lines.length;
  const col = lines[lines.length - 1].length + 1;
  return { message: String(msg), line, col };
}

function setError(e) {
  const raw = String(input.value || "");
  error.value = parseErrorDetails(raw, e?.message || "JSON parse hatası");
  okMsg.value = "";
}

function clearError() {
  error.value = null;
}

function normalizeIndent() {
  return indentSel.value === "tab" ? "\t" : Number(indentSel.value) || 2;
}

function deepSortKeys(obj) {
  if (Array.isArray(obj)) return obj.map(deepSortKeys);
  if (obj && typeof obj === "object") {
    const out = {};
    Object.keys(obj)
      .sort((a, b) => a.localeCompare(b))
      .forEach((k) => (out[k] = deepSortKeys(obj[k])));
    return out;
  }
  return obj;
}

/** ---------------------------
 * Actions
 * -------------------------- */
function validate() {
  okMsg.value = "";
  pathResult.value = null;

  const raw = String(input.value || "").trim();
  if (!raw) {
    error.value = { message: "JSON metni boş olamaz." };
    output.value = "";
    return;
  }

  try {
    JSON.parse(raw);
    clearError();
    okMsg.value = "JSON geçerli";
    output.value = "";
  } catch (e) {
    setError(e);
    output.value = "";
    // Hata satırına git
    if (inputEditor && error.value?.line) {
      inputEditor.revealLineInCenter(error.value.line);
      inputEditor.setPosition({
        lineNumber: error.value.line,
        column: error.value.col || 1,
      });
      inputEditor.focus();
    }
  }
}

function beautify() {
  okMsg.value = "";
  pathResult.value = null;

  const raw = String(input.value || "").trim();
  if (!raw) {
    error.value = { message: "JSON metni boş olamaz." };
    output.value = "";
    return;
  }

  try {
    const obj0 = JSON.parse(raw);
    const obj = sortKeys.value === "yes" ? deepSortKeys(obj0) : obj0;
    const out = JSON.stringify(obj, null, normalizeIndent());

    clearError();
    output.value = out;
    okMsg.value = "Biçimlendirildi";
  } catch (e) {
    setError(e);
    output.value = "";
  }
}

function minify() {
  okMsg.value = "";
  pathResult.value = null;

  const raw = String(input.value || "").trim();
  if (!raw) {
    error.value = { message: "JSON metni boş olamaz." };
    output.value = "";
    return;
  }

  try {
    const obj0 = JSON.parse(raw);
    const obj = sortKeys.value === "yes" ? deepSortKeys(obj0) : obj0;
    const out = JSON.stringify(obj);

    clearError();
    output.value = out;
    okMsg.value = "Sıkıştırıldı";
  } catch (e) {
    setError(e);
    output.value = "";
  }
}

function swap() {
  if (!output.value) return;
  input.value = output.value;
  output.value = "";
  okMsg.value = "Çıktı girdi oldu";
  clearError();
}

function clearAll() {
  input.value = "";
  output.value = "";
  error.value = null;
  okMsg.value = "";
  pathQuery.value = "";
  pathResult.value = null;
}

/** Upload/Download */
function onUpload(ev) {
  const f = ev.target.files?.[0];
  if (!f) return;

  const reader = new FileReader();
  reader.onload = () => {
    input.value = String(reader.result || "");
    okMsg.value = "Dosya yüklendi";
    clearError();
  };
  reader.readAsText(f);
}

function downloadOutput() {
  if (!output.value) return;
  const blob = new Blob([output.value], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "output.json";
  a.click();
  URL.revokeObjectURL(url);
}

/** Clipboard */
async function copyOutput() {
  if (!output.value) return;
  try {
    await navigator.clipboard.writeText(output.value);
    okMsg.value = "Çıktı kopyalandı";
    setTimeout(() => (okMsg.value = ""), 1000);
  } catch {}
}

async function copyInput() {
  if (!input.value) return;
  try {
    await navigator.clipboard.writeText(input.value);
    okMsg.value = "Girdi kopyalandı";
    setTimeout(() => (okMsg.value = ""), 1000);
  } catch {}
}

async function pasteFromClipboard() {
  try {
    const t = await navigator.clipboard.readText();
    if (t) {
      input.value = t;
      okMsg.value = "Yapıştırıldı";
      setTimeout(() => (okMsg.value = ""), 1000);
    }
  } catch {}
}

/** JSONPath (basit) */
function runPath() {
  pathResult.value = null;
  okMsg.value = "";
  const raw = String(input.value || "").trim();
  if (!raw) {
    error.value = { message: "JSON metni boş olamaz." };
    return;
  }

  try {
    const obj = JSON.parse(raw);
    clearError();

    const v = getByJsonPath(obj, pathQuery.value.trim());
    pathResult.value =
      v === undefined
        ? "Bulunamadı"
        : typeof v === "string"
        ? v
        : JSON.stringify(v, null, 2);
    okMsg.value = "JSONPath çalıştırıldı";
  } catch (e) {
    setError(e);
  }
}

// Çok basit JSONPath: $.a.b[0].c
function getByJsonPath(root, path) {
  if (!path || !path.startsWith("$")) return undefined;
  let cur = root;

  const tokens = path
    .replace(/^\$\./, "")
    .split(".")
    .flatMap((part) => {
      // foo[0][1] -> ["foo", "[0]", "[1]"]
      const m = part.match(/([^\[]+)|(\[\d+\])/g);
      return m || [];
    });

  for (const t of tokens) {
    if (t.startsWith("[")) {
      const idx = Number(t.replace(/\[|\]/g, ""));
      if (!Array.isArray(cur) || !Number.isFinite(idx)) return undefined;
      cur = cur[idx];
    } else {
      if (!cur || typeof cur !== "object") return undefined;
      cur = cur[t];
    }
  }
  return cur;
}

/** Convert */
function toJsonLines() {
  okMsg.value = "";
  const raw = String(input.value || "").trim();
  if (!raw) return;

  try {
    const obj = JSON.parse(raw);
    clearError();

    // array ise her elemanı 1 satır
    if (Array.isArray(obj)) {
      output.value = obj.map((x) => JSON.stringify(x)).join("\n");
      okMsg.value = "JSON → JSONL";
      return;
    }

    // object ise tek satır jsonl
    output.value = JSON.stringify(obj);
    okMsg.value = "JSON → JSONL";
  } catch (e) {
    setError(e);
    output.value = "";
  }
}

function fromJsonLines() {
  okMsg.value = "";
  const raw = String(input.value || "").trim();
  if (!raw) return;

  try {
    clearError();
    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const arr = lines.map((l) => JSON.parse(l));
    output.value = JSON.stringify(arr, null, normalizeIndent());
    okMsg.value = "JSONL → JSON Array";
  } catch (e) {
    error.value = {
      message: "JSONL satırlarından biri geçersiz JSON içeriyor.",
    };
    output.value = "";
  }
}

/** Monaco mount */
function onMountInput(ed) {
  inputEditor = ed;
}
function onMountOutput(ed) {
  outputEditor = ed;
}

/** Sample */
function loadSample() {
  input.value = `{
  "rules": [
    {
      "ruleNumber": "1",
      "beginTime": "2001-01-01",
      "endTime": "9999-12-29",
      "maps": [
        {
          "hierarchicalCode": "AKTIF-I-A-1",
          "accountCode": "100",
          "accountDescription": "Kasa",
          "direction": "D",
          "docType": "0"
        }
      ]
    }
  ]
}`;
  okMsg.value = "Örnek yüklendi";
  clearError();
  output.value = "";
  pathQuery.value = "$.rules[0].maps[0].accountCode";
  pathResult.value = null;
}

const inputStats = computed(() => {
  const b = bytesOf(input.value);
  const lines = String(input.value || "").split("\n").length;
  return `Satır: ${lines} • Boyut: ${b} byte`;
});

const outputStats = computed(() => {
  const b = bytesOf(output.value);
  const lines = String(output.value || "").split("\n").length;
  return output.value ? `Satır: ${lines} • Boyut: ${b} byte` : "—";
});

/** SEO */
useSeo({
  title: "JSON Formatter / Validator | Hesaplabs",
  description:
    "JSON formatter ile JSON metnini doğrula, beautify (pretty print) veya minify (compact). JSONPath ile alan ara, dosya yükle/indir.",
  canonical: computed(() => "https://hesaplabs.com/json-formatter"),
  ogUrl: computed(() => "https://hesaplabs.com/json-formatter"),
  ogType: "website",
  ogSiteName: "Hesaplabs",
  twitterCard: "summary_large_image",
});
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-lg border bg-white hover:shadow active:scale-[0.99] transition;
}
.btn-sm {
  @apply px-3 py-1.5 rounded-lg border bg-white hover:shadow text-sm active:scale-[0.99] transition disabled:opacity-50;
}
.action {
  @apply w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50;
}
.input {
  @apply w-full px-3 py-2 rounded-lg border bg-white text-sm;
}
.select {
  @apply w-full px-3 py-2 rounded-lg border bg-white text-sm;
}
</style>
