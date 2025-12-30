<template>
  <section class="space-y-8">
    <!-- Giriş alanları -->
    <div
      class="bg-white border border-slate-200 shadow-sm rounded-xl p-4 sm:p-6"
    >
      <p class="text-slate-600 text-sm sm:text-base mb-4">
        İki JSON metnini yan yana gir, araç senin için biçimlendirip satır
        bazında farkları vurgulasın. Hem doğrulama hem de görsel karşılaştırma
        için idealdir.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Sol JSON -->
        <div>
          <label
            class="block text-sm font-medium text-slate-700 mb-2"
            for="left-json"
          >
            Sol JSON
          </label>
          <textarea
            id="left-json"
            v-model="leftRaw"
            rows="14"
            class="block w-full font-mono text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50/60"
            placeholder='Örn: { "name": "Ali", "age": 25 }'
          ></textarea>

          <p v-if="leftError" class="mt-2 text-xs text-red-600">
            {{ leftError }}
          </p>
        </div>

        <!-- Sağ JSON -->
        <div>
          <label
            class="block text-sm font-medium text-slate-700 mb-2"
            for="right-json"
          >
            Sağ JSON
          </label>
          <textarea
            id="right-json"
            v-model="rightRaw"
            rows="14"
            class="block w-full font-mono text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50/60"
            placeholder='Örn: { "name": "Ali", "age": 26 }'
          ></textarea>

          <p v-if="rightError" class="mt-2 text-xs text-red-600">
            {{ rightError }}
          </p>
        </div>
      </div>

      <div
        class="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          @click="formatAndCompare"
        >
          Biçimlendir &amp; Karşılaştır
        </button>

        <p class="text-xs text-slate-500">
          İpucu: Geçerli JSON yazdığından emin ol. Anahtar adları tırnak içinde
          olmalı (<code>"name"</code> gibi) ve son elemanlardan sonra fazladan
          virgül olmamalı.
        </p>
      </div>
    </div>

    <!-- Sonuç alanı -->
    <div
      v-if="hasCompared"
      class="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6"
    >
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4"
      >
        <h3 class="text-base sm:text-lg font-semibold text-slate-900">
          Biçimlendirilmiş JSON ve Farklar
        </h3>
        <p class="text-xs text-slate-500">
          Aynı satırlar normal, farklı satırlar
          <span class="text-red-600 font-semibold">kırmızı</span> arka plan ile
          vurgulanır. Sadece boşluk farkları da dikkate alınır.
        </p>
      </div>

      <!-- Hatalar -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div v-if="leftError" class="text-xs text-red-600">
          Sol JSON hatası: {{ leftError }}
        </div>
        <div v-if="rightError" class="text-xs text-red-600">
          Sağ JSON hatası: {{ rightError }}
        </div>
      </div>

      <!-- Satır bazında diff -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Sol sonuç -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-600">
              Sol JSON (Biçimlendirilmiş)
            </span>
            <button
              type="button"
              class="text-xs px-2.5 py-1 rounded border border-slate-300 text-slate-700 bg-white hover:bg-slate-100"
              @click="downloadSide('left')"
              :disabled="!leftFormatted"
            >
              JSON'u indir
            </button>
          </div>

          <div
            class="border border-slate-300 bg-white rounded-lg overflow-auto max-h-[420px]"
          >
            <div
              v-for="(line, index) in leftLines"
              :key="'l-' + index"
              class="flex text-xs font-mono"
            >
              <div
                class="w-10 flex-shrink-0 text-right pr-2 py-0.5 select-none bg-slate-50 border-r border-slate-200 text-slate-400"
              >
                {{ index + 1 }}
              </div>
              <pre
                class="flex-1 whitespace-pre px-3 py-0.5"
                :class="lineClass(line.status)"
                >{{ line.text }}</pre
              >
            </div>
          </div>
        </div>

        <!-- Sağ sonuç -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-600">
              Sağ JSON (Biçimlendirilmiş)
            </span>
            <button
              type="button"
              class="text-xs px-2.5 py-1 rounded border border-slate-300 text-slate-700 bg-white hover:bg-slate-100"
              @click="downloadSide('right')"
              :disabled="!rightFormatted"
            >
              JSON'u indir
            </button>
          </div>

          <div
            class="border border-slate-300 bg-white rounded-lg overflow-auto max-h-[420px]"
          >
            <div
              v-for="(line, index) in rightLines"
              :key="'r-' + index"
              class="flex text-xs font-mono"
            >
              <div
                class="w-10 flex-shrink-0 text-right pr-2 py-0.5 select-none bg-slate-50 border-r border-slate-200 text-slate-400"
              >
                {{ index + 1 }}
              </div>
              <pre
                class="flex-1 whitespace-pre px-3 py-0.5"
                :class="lineClass(line.status)"
                >{{ line.text }}</pre
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Açıklama / öğretici bölüm -->
    <div
      class="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 text-sm text-slate-700 space-y-3"
    >
      <h3 class="text-base font-semibold text-slate-900">
        JSON Karşılaştırma Nasıl Çalışır?
      </h3>
      <p>
        JSON (JavaScript Object Notation), veriyi anahtar–değer çiftleriyle
        tanımlayan, insan tarafından okunabilir hafif bir veri formatıdır. API
        cevaplarında, ayar dosyalarında, veritabanı yapılarında ve daha birçok
        yerde kullanılır.
      </p>
      <ol class="list-decimal pl-5 space-y-1">
        <li>
          Sol ve sağ alana karşılaştırmak istediğiniz JSON'ları yapıştırın veya
          yazın.
        </li>
        <li>
          <strong>Biçimlendir &amp; Karşılaştır</strong> butonuna tıklayın. Araç
          her iki JSON'u da otomatik olarak pretty-print (girintili ve okunur)
          hale getirir.
        </li>
        <li>
          Satırlar yan yana getirilir ve fark olan satırlar kırmızı arka planla
          vurgulanır. Yalnızca bir tarafta bulunan satırlar da yine vurgulanarak
          gösterilir.
        </li>
        <li>
          Dilerseniz her iki sütunun üstündeki
          <strong>JSON'u indir</strong> butonlarıyla biçimlendirilmiş JSON'u
          dosya olarak kaydedebilirsiniz.
        </li>
      </ol>
      <h4 class="font-semibold text-slate-900 pt-1">Yaygın JSON Hataları</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>
          Anahtar adları mutlaka çift tırnak içinde olmalıdır:
          <code>"name": "Ali"</code>.
        </li>
        <li>
          Nesne veya dizilerin son elemanından sonra fazladan virgül
          kullanılmamalıdır.
        </li>
        <li>
          Tek tırnak (`'`) JSON'da geçerli değildir, her zaman çift tırnak (`"`)
          kullanılmalıdır.
        </li>
      </ul>
      <p class="text-xs text-slate-500">
        Tüm işlemler tarayıcın içinde gerçekleşir; JSON verilerin sunucuya
        gönderilmez. Böylece hassas verilerle çalışırken bile güvenle
        kullanabilirsin.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const leftRaw = ref("");
const rightRaw = ref("");

const leftError = ref("");
const rightError = ref("");

const hasCompared = ref(false);

const leftLines = ref([]);
const rightLines = ref([]);

const leftFormatted = ref("");
const rightFormatted = ref("");

// JSON'u parse edip pretty-print ederek satır bazında karşılaştır
function formatAndCompare() {
  leftError.value = "";
  rightError.value = "";
  hasCompared.value = false;
  leftLines.value = [];
  rightLines.value = [];
  leftFormatted.value = "";
  rightFormatted.value = "";

  let leftObj, rightObj;

  // Sol JSON
  try {
    leftObj = JSON.parse(leftRaw.value);
  } catch (e) {
    leftError.value = "Sol JSON geçerli değil: " + e.message;
  }

  // Sağ JSON
  try {
    rightObj = JSON.parse(rightRaw.value);
  } catch (e) {
    rightError.value = "Sağ JSON geçerli değil: " + e.message;
  }

  if (leftError.value || rightError.value) {
    hasCompared.value = true;
    return;
  }

  const leftPretty = JSON.stringify(leftObj, null, 2);
  const rightPretty = JSON.stringify(rightObj, null, 2);

  leftFormatted.value = leftPretty;
  rightFormatted.value = rightPretty;

  const leftArr = leftPretty.split("\n");
  const rightArr = rightPretty.split("\n");
  const maxLen = Math.max(leftArr.length, rightArr.length);

  const lLines = [];
  const rLines = [];

  for (let i = 0; i < maxLen; i++) {
    const l = leftArr[i] ?? "";
    const r = rightArr[i] ?? "";

    let lStatus = "same";
    let rStatus = "same";

    if (l === r) {
      lStatus = rStatus = "same";
    } else {
      if (l && !r) {
        lStatus = "only-left"; // sadece solda
        rStatus = "empty";
      } else if (!l && r) {
        lStatus = "empty";
        rStatus = "only-right"; // sadece sağda
      } else {
        lStatus = rStatus = "changed"; // her ikisinde de farklı
      }
    }

    lLines.push({ text: l, status: lStatus });
    rLines.push({ text: r, status: rStatus });
  }

  leftLines.value = lLines;
  rightLines.value = rLines;
  hasCompared.value = true;
}

// Duruma göre satır rengi
function lineClass(status) {
  switch (status) {
    case "changed":
      return "bg-red-50 text-slate-900";
    case "only-left":
    case "only-right":
      return "bg-orange-50 text-slate-900";
    default:
      return "bg-white text-slate-800";
  }
}

// İlgili tarafın JSON'unu indir
function downloadSide(side) {
  const content = side === "left" ? leftFormatted.value : rightFormatted.value;
  if (!content) return;

  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = side === "left" ? "json-sol.json" : "json-sag.json";
  a.click();
  URL.revokeObjectURL(url);
}
</script>
