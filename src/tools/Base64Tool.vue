<!-- src/tools/Base64Tool.vue -->
<template>
  <div class="max-w-6xl mx-auto space-y-10">
    <!-- Başlık -->
    <header class="space-y-2">
      <p class="text-sm sm:text-base text-slate-600">
        Metin veya dosyalarınızı güvenli bir şekilde Base64 formatına dönüştürün
        ya da Base64 kodlarını geri çözüp orijinal haline getirin.
      </p>
    </header>

    <!-- DECODE BLOKU -->
    <section class="space-y-4">
      <!-- Metin decode: giriş & çıkış yan yana -->
      <div
        class="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4"
      >
        <div class="flex flex-col md:flex-row gap-4 md:gap-6">
          <!-- Giriş -->
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-slate-900 mb-2">
              Base64 Decode (Metin)
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 mb-3">
              Elinizdeki Base64 kodunu sol tarafa yazın; araç sizin için gerçek
              metne dönüştürsün.
            </p>

            <label class="block text-xs font-medium text-slate-500 mb-1">
              Base64 kodu
            </label>
            <textarea
              v-model="decodeTextInput"
              rows="8"
              class="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Örn: TWFya2UgZG9rYXJpc20u"
            ></textarea>

            <button
              @click="decodeText"
              class="mt-3 inline-flex items-center justify-center rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Decode Et
            </button>
          </div>

          <!-- Çıkış -->
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-slate-900 mb-2">
              Çözülen Metin
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 mb-3">
              Sağ tarafta, çözülen metni doğrudan kopyalayabilir veya üzerinde
              düzenleme yapabilirsiniz.
            </p>

            <label class="block text-xs font-medium text-slate-500 mb-1">
              Sonuç
            </label>
            <textarea
              v-model="decodeTextOutput"
              rows="8"
              readonly
              class="w-full text-sm rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              placeholder="Sonuç burada görünecek"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Dosya decode -->
      <div
        class="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
      >
        <h3 class="text-base font-semibold text-slate-900 mb-2">
          Base64 Decode (Dosya)
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 mb-3">
          Base64 kodu içeren bir dosya seçin; çözülen halini indirilebilir dosya
          olarak alın.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div class="flex-1">
            <label class="block text-xs font-medium text-slate-500 mb-1">
              Base64 dosyası
            </label>
            <input
              type="file"
              @change="onDecodeFileChange"
              class="block w-full text-xs sm:text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          <button
            @click="decodeFile"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
          >
            Decode Et ve İndir
          </button>
        </div>

        <p class="mt-3 text-[11px] sm:text-xs text-slate-500 leading-relaxed">
          • Maksimum dosya boyutu: 10&nbsp;MB<br />
          • İşlemler tarayıcınızda yapılır; dosya sunucuya gönderilmez.
        </p>
      </div>
    </section>

    <!-- ENCODE BLOKU -->
    <section class="space-y-4">
      <!-- Metin encode: giriş & çıkış yan yana -->
      <div
        class="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4"
      >
        <div class="flex flex-col md:flex-row gap-4 md:gap-6">
          <!-- Giriş -->
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-slate-900 mb-2">
              Base64 Encode (Metin)
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 mb-3">
              Normal bir metni Base64 formatına dönüştürmek için sol tarafa
              yazmanız yeterli.
            </p>

            <label class="block text-xs font-medium text-slate-500 mb-1">
              Dönüştürülecek metin
            </label>
            <textarea
              v-model="encodeTextInput"
              rows="8"
              class="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Örn: Merhaba Dünya"
            ></textarea>

            <button
              @click="encodeText"
              class="mt-3 inline-flex items-center justify-center rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Encode Et
            </button>
          </div>

          <!-- Çıkış -->
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-slate-900 mb-2">
              Base64 Çıktısı
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 mb-3">
              Sağ tarafta oluşan Base64 kodunu kopyalayarak dilediğiniz yerde
              kullanabilirsiniz.
            </p>

            <label class="block text-xs font-medium text-slate-500 mb-1">
              Sonuç
            </label>
            <textarea
              v-model="encodeTextOutput"
              rows="8"
              readonly
              class="w-full text-sm rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              placeholder="Base64 sonucu burada görünecek"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Dosya encode -->
      <div
        class="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
      >
        <h3 class="text-base font-semibold text-slate-900 mb-2">
          Base64 Encode (Dosya)
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 mb-3">
          Bir dosyayı (görsel, PDF, vb.) Base64 formatına dönüştürüp çıktıyı
          kopyalayabilirsiniz.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div class="flex-1">
            <label class="block text-xs font-medium text-slate-500 mb-1">
              Dönüştürülecek dosya
            </label>
            <input
              type="file"
              @change="onEncodeFileChange"
              class="block w-full text-xs sm:text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          <button
            @click="encodeFile"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
          >
            Encode Et
          </button>
        </div>

        <label class="block text-xs font-medium text-slate-500 mt-4 mb-1">
          Base64 çıktısı
        </label>
        <textarea
          v-model="encodeFileOutput"
          rows="6"
          readonly
          class="w-full text-sm rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
          placeholder="Dosyanın Base64 hali burada görünecek"
        ></textarea>
      </div>
    </section>

    <!-- AÇIKLAMA + İPUÇLARI -->
    <section class="grid gap-6 lg:grid-cols-[2fr,1fr] mt-4">
      <!-- Öğretici metin -->
      <article
        class="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4"
      >
        <h2 class="text-lg sm:text-xl font-semibold text-slate-900">
          Base64 Nedir? Nasıl Çalışır?
        </h2>

        <p class="text-sm text-slate-700 leading-relaxed">
          <strong>Base64</strong>, ikili (binary) verileri okunabilir metin
          karakterleriyle ifade etmek için kullanılan bir kodlama yöntemidir.
          Yani bilgisayarın anladığı ham baytları; harfler, rakamlar ve birkaç
          özel karakterden oluşan güvenli bir metne dönüştürür.
        </p>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-slate-900">
            Nerede Kullanılır?
          </h3>
          <ul class="list-disc pl-5 text-sm text-slate-700 space-y-1">
            <li>API isteklerinde dosya veya görsel göndermek istediğinizde,</li>
            <li>JSON içinde küçük dosyaları gömmek gerektiğinde,</li>
            <li>E-posta eklerini metin formatında iletmek için,</li>
            <li>
              Veriyi bozulmadan saklamak veya taşımak istediğiniz her yerde.
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-slate-900">
            Mantığı Kısaca Nasıl İşler?
          </h3>
          <p class="text-sm text-slate-700 leading-relaxed">
            Bilgisayarda her karakter belirli bir sayı ile temsil edilir.
            Base64, bu sayıları 6 şarlı gruplara ayırır ve her grubu özel bir
            karakterle eşleştirir. Böylece yalnızca
            <code class="px-1 mx-1 rounded bg-slate-100 text-[11px]">A-Z</code>,
            <code class="px-1 mx-1 rounded bg-slate-100 text-[11px]">a-z</code>,
            <code class="px-1 mx-1 rounded bg-slate-100 text-[11px]">0-9</code>,
            <code class="px-1 mx-1 rounded bg-slate-100 text-[11px]">+</code> ve
            <code class="px-1 mx-1 rounded bg-slate-100 text-[11px]">/</code>
            karakterlerini kullanarak tüm veriyi temsil edebilir.
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-slate-900">Küçük Bir Örnek</h3>
          <p class="text-sm text-slate-700">
            Örneğin <strong>"Merhaba Dünya"</strong> metni Base64'e
            çevrildiğinde:
          </p>
          <div
            class="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[12px] sm:text-xs font-mono text-slate-800"
          >
            Metin: <span class="font-semibold">Merhaba Dünya</span><br />
            Base64: <span class="font-semibold">TUVyaGFiYSBEw7xueWE=</span>
          </div>
          <p class="text-[11px] sm:text-xs text-slate-600">
            Yukarıdaki alanlarda bu örneği deneyebilir, hem encode hem decode
            işlemini adım adım görebilirsiniz.
          </p>
        </div>

        <p class="text-sm text-slate-700 leading-relaxed">
          Bu araç, hem geliştiriciler hem de teknik olmayan kullanıcılar için
          tasarlandı. Tüm işlemler tarayıcınızda gerçekleşir; verileriniz
          sunucuya gönderilmez.
        </p>
      </article>

      <!-- İpuçları kutusu -->
      <aside
        class="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 text-sm text-slate-700 shadow-sm"
      >
        <h3 class="text-sm font-semibold text-slate-900 mb-2">
          Kullanım İpuçları
        </h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>
            Base64 şifreleme değildir, sadece <em>kodlama</em> yöntemidir.
          </li>
          <li>
            Uzun Base64 çıktıları genelde tek satır tutulur; satır kırmak bazı
            kütüphanelerde sorun çıkarabilir.
          </li>
          <li>
            Çok büyük dosyaları Base64'e çevirmek, boyutu yaklaşık %30 civarında
            artırır; her senaryoda ideal olmayabilir.
          </li>
          <li>
            Hata alırsanız, Base64 metninde fazladan boşluk veya satır sonu
            kalmadığından emin olun.
          </li>
        </ul>
      </aside>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

// metin decode
const decodeTextInput = ref("TWFya2UgZG9rYXJpc20u");
const decodeTextOutput = ref("");

// metin encode
const encodeTextInput = ref("Merhaba Dünya");
const encodeTextOutput = ref("");

// dosya işlemleri
const decodeFileInput = ref(null);
const encodeFileInput = ref(null);
const encodeFileOutput = ref("");

const onDecodeFileChange = (e) => {
  decodeFileInput.value = e.target.files[0] || null;
};

const onEncodeFileChange = (e) => {
  encodeFileInput.value = e.target.files[0] || null;
};

const decodeText = () => {
  try {
    decodeTextOutput.value = atob(decodeTextInput.value || "");
  } catch (err) {
    decodeTextOutput.value = "Geçersiz Base64 metni.";
  }
};

const encodeText = () => {
  try {
    encodeTextOutput.value = btoa(
      encodeURIComponent(encodeTextInput.value).replace(
        /%([0-9A-F]{2})/g,
        (_, p1) => String.fromCharCode("0x" + p1)
      )
    );
  } catch (err) {
    encodeTextOutput.value = "Metin encode edilirken bir hata oluştu.";
  }
};

const decodeFile = () => {
  if (!decodeFileInput.value) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const base64Text = reader.result.toString();
      const decoded = atob(base64Text);
      const blob = new Blob([decoded]);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "decoded-file";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(
        "Dosya decode edilirken bir hata oluştu. Dosyanın geçerli bir Base64 içerdiğinden emin olun."
      );
    }
  };
  reader.readAsText(decodeFileInput.value);
};

const encodeFile = () => {
  if (!encodeFileInput.value) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result.toString().split(",")[1] || "";
    encodeFileOutput.value = base64;
  };
  reader.readAsDataURL(encodeFileInput.value);
};
</script>
