<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-10">
    <!-- Breadcrumb -->
    <nav class="text-sm text-slate-500 mb-2">
      <span class="hover:underline cursor-pointer">Kodlama Araçları</span>
      <span class="mx-1">/</span>
      <span class="font-medium text-slate-700">URL Encode / Decode</span>
    </nav>

    <!-- Başlık -->
    <header class="space-y-2">
      <p class="text-slate-600 max-w-3xl">
        Metinlerinizi web adreslerinde güvenle kullanabileceğiniz URL formatına
        dönüştürün veya URL içinde gördüğünüz kodlu ifadeleri normal metne geri
        çevirin. Türkçe karakterler, boşluklar ve özel semboller için idealdir.
      </p>
    </header>

    <!-- URL Decode (Metin) -->
    <section class="bg-white border rounded-xl shadow-sm p-4 md:p-6 space-y-4">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-lg font-semibold text-slate-900">URL Decode (Metin)</h2>
        <p class="text-xs md:text-sm text-slate-500">
          Elinizdeki URL kodlu metni çözüp okunabilir hâle getirin.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-slate-700">
            URL kodlu metin
          </label>
          <textarea
            v-model="encodedInput"
            class="min-h-[140px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Örn: Merhaba%20D%C3%BCnya%21"
          ></textarea>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              @click="decodeText"
              class="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            >
              Decode Et
            </button>

            <button
              type="button"
              @click="clearDecode"
              class="text-xs md:text-sm text-slate-500 hover:text-slate-700"
            >
              Temizle
            </button>

            <label
              class="ml-auto inline-flex items-center gap-2 text-xs md:text-sm text-slate-600 cursor-pointer"
            >
              <span>Dosyadan yükle</span>
              <input
                type="file"
                accept=".txt"
                class="hidden"
                @change="handleDecodeFile"
              />
              <span
                class="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50"
              >
                Dosya Seç
              </span>
            </label>
          </div>

          <p class="text-xs text-slate-500">
            Dosya yüklediğinizde içeriği sol alandaki kutuya metin olarak
            aktarılır. Yalnızca metin dosyaları (.txt) desteklenir.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-slate-700">
            Çözülen metin
          </label>
          <textarea
            v-model="decodedOutput"
            class="min-h-[140px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Sonuç burada görünecek"
          ></textarea>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              @click="downloadDecoded"
              class="inline-flex items-center justify-center rounded-md border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50"
            >
              Çözülen Metni İndir
            </button>
            <span class="text-[11px] md:text-xs text-slate-400">
              * İndirme .txt dosyası olarak yapılır.
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- URL Encode (Metin) -->
    <section class="bg-white border rounded-xl shadow-sm p-4 md:p-6 space-y-4">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-lg font-semibold text-slate-900">URL Encode (Metin)</h2>
        <p class="text-xs md:text-sm text-slate-500">
          Normal metni, web adreslerinde güvenle kullanılabilecek URL formatına
          dönüştürün.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-slate-700">
            Dönüştürülecek metin
          </label>
          <textarea
            v-model="plainInput"
            class="min-h-[140px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Örn: Merhaba Dünya! Türkçe karakterler, boşluklar..."
          ></textarea>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              @click="encodeText"
              class="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            >
              Encode Et
            </button>

            <button
              type="button"
              @click="clearEncode"
              class="text-xs md:text-sm text-slate-500 hover:text-slate-700"
            >
              Temizle
            </button>

            <label
              class="ml-auto inline-flex items-center gap-2 text-xs md:text-sm text-slate-600 cursor-pointer"
            >
              <span>Dosyadan yükle</span>
              <input
                type="file"
                accept=".txt"
                class="hidden"
                @change="handleEncodeFile"
              />
              <span
                class="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50"
              >
                Dosya Seç
              </span>
            </label>
          </div>

          <p class="text-xs text-slate-500">
            Dosya içeriği sol tarafa metin olarak aktarılır, buradan encode
            işlemini yapabilirsiniz.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-slate-700">
            URL kodlu çıktı
          </label>
          <textarea
            v-model="encodedOutput"
            class="min-h-[140px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Encode sonucu burada görünecek"
          ></textarea>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              @click="downloadEncoded"
              class="inline-flex items-center justify-center rounded-md border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50"
            >
              Encode Sonucunu İndir
            </button>
            <span class="text-[11px] md:text-xs text-slate-400">
              * Çıktıyı linklerde, query stringlerde veya API çağrılarında
              kullanabilirsiniz.
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Açıklama & Öğretici bölüm -->
    <section class="grid gap-6 md:grid-cols-2">
      <!-- Teorik anlatım -->
      <div class="bg-white border rounded-xl shadow-sm p-4 md:p-6 space-y-3">
        <h2 class="text-lg font-semibold text-slate-900">
          URL Encode Nedir? Neden Kullanılır?
        </h2>
        <p class="text-sm text-slate-600 leading-relaxed">
          URL&apos;ler (web adresleri) yalnızca belirli karakterleri doğrudan
          taşıyabilir. Boşluk, Türkçe karakterler (&quot;ç, ğ, ı, ö, ş,
          ü&quot;), soru işareti, iki nokta üst üste gibi özel karakterler,
          adres içinde farklı anlamlara geldiği için doğrudan yazılamaz.
        </p>
        <p class="text-sm text-slate-600 leading-relaxed">
          <strong>URL encode işlemi</strong>, bu özel karakterleri güvenli bir
          koda dönüştürür. Örneğin bir boşluk karakteri
          <code class="px-1 mx-1 rounded bg-slate-100 text-xs"> %20 </code>
          olarak yazılır. Böylece adres bozulmadan, tarayıcı ve sunucular
          tarafından doğru yorumlanır.
        </p>
        <p class="text-sm text-slate-600 leading-relaxed">
          <strong>URL decode işlemi</strong> ise bunun tam tersidir: Adres
          içinde gördüğünüz{" "}
          <code class="px-1 mx-1 rounded bg-slate-100 text-xs">
            %C3%BC,%20%3F,%20%26 </code
          >{" "} gibi kodları tekrar okunabilir Türkçe metne çevirir.
        </p>

        <div
          class="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-3 text-sm text-slate-700 space-y-1"
        >
          <p class="font-semibold text-slate-800">Basit Örnek:</p>
          <p>
            Metin:
            <code class="px-1 mx-1 rounded bg-slate-100 text-xs">
              Merhaba Dünya!
            </code>
          </p>
          <p>
            URL encode sonucu:
            <code class="px-1 mx-1 rounded bg-slate-100 text-xs">
              Merhaba%20D%C3%BCnya%21
            </code>
          </p>
        </div>
      </div>

      <!-- Adım adım kullanım & ipuçları -->
      <div class="bg-white border rounded-xl shadow-sm p-4 md:p-6 space-y-3">
        <h2 class="text-lg font-semibold text-slate-900">
          Adım Adım Nasıl Kullanılır?
        </h2>
        <ol class="list-decimal ml-4 space-y-1 text-sm text-slate-600">
          <li>
            <strong>URL Decode</strong> yapmak istiyorsanız:
            <ul class="list-disc ml-4 mt-1 space-y-1">
              <li>
                Sol üstteki <strong>URL Decode (Metin)</strong> bölümüne
                çalışmak istediğiniz kodlu adresi veya kısmını yapıştırın.
              </li>
              <li>
                <strong>Decode Et</strong> butonuna basın; sağ tarafta normal
                okunabilir metni göreceksiniz.
              </li>
              <li>
                İsterseniz sonucu düzenleyebilir veya <strong>İndir</strong>
                butonuyla .txt olarak kaydedebilirsiniz.
              </li>
            </ul>
          </li>
          <li>
            <strong>URL Encode</strong> yapmak istiyorsanız:
            <ul class="list-disc ml-4 mt-1 space-y-1">
              <li>
                Alt bölümdeki <strong>URL Encode (Metin)</strong> alanına normal
                metni yazın veya dosyadan yükleyin.
              </li>
              <li>
                <strong>Encode Et</strong> butonuna bastığınızda sağ tarafta
                URL&apos;de güvenle kullanabileceğiniz kodlu sürüm oluşur.
              </li>
              <li>
                Bu çıktıyı doğrudan linklerinizde, query string parametrelerinde
                veya API çağrılarınızda kullanabilirsiniz.
              </li>
            </ul>
          </li>
        </ol>

        <div class="mt-3">
          <h3 class="text-sm font-semibold text-slate-800 mb-1">
            Kullanım İpuçları
          </h3>
          <ul class="list-disc ml-4 space-y-1 text-sm text-slate-600">
            <li>
              <strong>Boşluklar</strong>, genellikle
              <code class="px-1 mx-1 rounded bg-slate-100 text-xs"> %20 </code>
              olarak encode edilir.
            </li>
            <li>
              Türkçe karakterlerin bozulmaması için URL encode kullanmak
              özellikle önemlidir.
            </li>
            <li>
              Bu araç tamamen tarayıcınız içinde çalışır; yazdığınız veya
              yüklediğiniz metinler sunucuya gönderilmez.
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Decode state
const encodedInput = ref("");
const decodedOutput = ref("");

// Encode state
const plainInput = ref("");
const encodedOutput = ref("");

// URL Decode (metin)
function decodeText() {
  if (!encodedInput.value) {
    decodedOutput.value = "";
    return;
  }

  try {
    // + işaretlerini boşluğa çevir, sonra decode et
    const normalized = encodedInput.value.replace(/\+/g, " ");
    decodedOutput.value = decodeURIComponent(normalized);
  } catch (e) {
    decodedOutput.value =
      "Decode sırasında bir hata oluştu. Metnin geçerli bir URL kodu olduğundan emin olun.";
  }
}

// URL Encode (metin)
function encodeText() {
  if (!plainInput.value) {
    encodedOutput.value = "";
    return;
  }

  encodedOutput.value = encodeURIComponent(plainInput.value);
}

// Temizle butonları
function clearDecode() {
  encodedInput.value = "";
  decodedOutput.value = "";
}

function clearEncode() {
  plainInput.value = "";
  encodedOutput.value = "";
}

// Dosya yükleme - Decode
function handleDecodeFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    encodedInput.value = String(reader.result || "");
  };
  reader.readAsText(file, "utf-8");
  event.target.value = "";
}

// Dosya yükleme - Encode
function handleEncodeFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    plainInput.value = String(reader.result || "");
  };
  reader.readAsText(file, "utf-8");
  event.target.value = "";
}

// İndirme yardımcıları
function downloadText(filename, text) {
  if (!text) return;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadDecoded() {
  downloadText("url-decoded.txt", decodedOutput.value);
}

function downloadEncoded() {
  downloadText("url-encoded.txt", encodedOutput.value);
}
</script>
