<!-- src/tools/JwtDecoderTool.vue -->
<template>
  <section class="space-y-8">
    <!-- Açıklama -->
    <header class="space-y-2">
      <p class="text-sm text-slate-600">
        <code class="font-mono">header.payload.signature</code>. Bu araç,
        tarayıcı içinde çalışarak gönderdiğin JWT'nin <strong>header</strong> ve
        <strong>payload</strong> kısımlarını güvenli bir şekilde çözüp
        okunabilir JSON haline getirir.
      </p>

      <div
        class="inline-flex flex-wrap items-center gap-2 text-xs text-slate-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100"
      >
        <span class="font-semibold text-amber-700">Önemli Uyarı:</span>
        <span>
          Bu araç yalnızca <strong>decode</strong> işlemi yapar,
          <strong>imza doğrulaması (verify)</strong>
          yapmaz. Yani token’ın gerçekten güvenilir bir kaynaktan gelip
          gelmediğini değil, yalnızca içinde hangi bilgiler olduğunu görmeni
          sağlar.
        </span>
      </div>
    </header>

    <!-- Girdi -->
    <section class="space-y-3">
      <label class="block text-sm font-medium text-slate-800">
        JWT Token
      </label>
      <textarea
        v-model="token"
        class="w-full h-40 md:h-48 border border-slate-200 rounded-lg px-3 py-2 text-xs md:text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
        placeholder="header.payload.signature şeklindeki JWT token&#39;ı buraya yapıştır."
        spellcheck="false"
      ></textarea>

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          :disabled="!token.trim()"
          @click="decodeJwt"
        >
          JWT&#39;yi Decode Et
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs md:text-sm hover:bg-slate-200 transition"
          @click="clearAll"
        >
          Temizle
        </button>
      </div>

      <p v-if="error" class="text-xs text-red-600">
        {{ error }}
      </p>
    </section>

    <!-- Sonuçlar -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Header -->
      <div class="lg:col-span-1 space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-800">Header</h2>
          <span class="text-[11px] uppercase tracking-wide text-slate-500"
            >Algoritma &amp; Tip</span
          >
        </div>

        <div
          class="border border-slate-200 rounded-lg bg-slate-50/80 px-3 py-2 h-48 md:h-56 overflow-auto text-xs md:text-sm font-mono text-slate-800 whitespace-pre-wrap"
        >
          <pre v-if="headerJson">{{ headerJson }}</pre>
          <p v-else class="text-slate-400">
            Örneğin <code class="font-mono">alg</code> ve
            <code class="font-mono">typ</code> alanları burada görünür.
          </p>
        </div>
      </div>

      <!-- Payload -->
      <div class="lg:col-span-2 space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-800">Payload (Claims)</h2>
          <span class="text-[11px] uppercase tracking-wide text-slate-500">
            Kullanıcı bilgileri &amp; süreler
          </span>
        </div>

        <div
          class="border border-slate-200 rounded-lg bg-slate-50/80 px-3 py-2 h-48 md:h-56 overflow-auto text-xs md:text-sm font-mono text-slate-800 whitespace-pre-wrap"
        >
          <pre v-if="payloadJson">{{ payloadJson }}</pre>
          <p v-else class="text-slate-400">
            email, sub, exp, iat gibi claim bilgileri burada JSON olarak
            gösterilir.
          </p>
        </div>
      </div>
    </section>

    <!-- Öğretici açıklama -->
    <section
      class="border border-slate-100 rounded-xl bg-slate-50/60 p-4 md:p-5 space-y-3"
    >
      <h2 class="text-sm font-semibold text-slate-800">
        JWT Nasıl Çalışır? Adım Adım Anlatım
      </h2>

      <ol
        class="list-decimal list-inside space-y-1 text-xs md:text-sm text-slate-700"
      >
        <li>
          JWT, noktayla ayrılmış üç parçadan oluşur:
          <code class="font-mono">header.payload.signature</code>.
        </li>
        <li>
          <strong>Header</strong>, genellikle kullanılan imzalama algoritmasını
          (<code>alg</code>) ve token tipini (<code>typ</code>) içerir.
        </li>
        <li>
          <strong>Payload</strong>, kullanıcıya ait claim’leri (ör.
          <code>sub</code>, <code>email</code>, <code>exp</code>,
          <code>role</code> …) barındırır. Asıl işine yarayan kısım burasıdır.
        </li>
        <li>
          <strong>Signature</strong> ise gizli bir anahtar ile üretilir ve
          token’ın bütünlüğünü korur. Bu araç imzayı hesaplamaz veya doğrulamaz;
          sadece ilk iki kısmı Base64URL formatından çözüp okunur hale getirir.
        </li>
        <li>
          Güvenlik açısından, bu araç sadece tarayıcı içinde çalışır ve
          gönderdiğin token’ı sunucuya iletmez. Yine de gerçek üretim
          token’larını paylaşırken dikkatli olmanı tavsiye ederiz.
        </li>
      </ol>

      <p class="text-xs md:text-sm text-slate-700">
        Bu tür bir <strong>JWT Decoder</strong>, özellikle yetkilendirme
        sorunlarını debug ederken, test ortamındaki token’ları kontrol ederken
        veya bir üçüncü parti sistemin gönderdiği token’ın içinde hangi
        bilgilerin taşındığını görmek istediğinde oldukça pratiktir.
      </p>
    </section>
  </section>
</template>

<script setup>
import { ref } from "vue";

const token = ref("");
const headerJson = ref("");
const payloadJson = ref("");
const error = ref("");

function base64UrlDecode(str) {
  // Base64URL -> Base64
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = output.length % 4;
  if (pad === 2) output += "==";
  else if (pad === 3) output += "=";
  else if (pad !== 0) throw new Error("Geçersiz Base64URL uzunluğu");

  // decode
  const decoded = atob(output);
  try {
    // UTF-8 karakterler için decode
    return decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return decoded;
  }
}

function decodeJwt() {
  error.value = "";
  headerJson.value = "";
  payloadJson.value = "";

  if (!token.value.trim()) return;

  const parts = token.value.trim().split(".");
  if (parts.length < 2) {
    error.value =
      "Geçerli bir JWT için en az iki nokta ile ayrılmış üç parça (header.payload.signature) olmalıdır.";
    return;
  }

  const [headerPart, payloadPart] = parts;

  try {
    const headerStr = base64UrlDecode(headerPart);
    const headerObj = JSON.parse(headerStr);
    headerJson.value = JSON.stringify(headerObj, null, 2);
  } catch (e) {
    error.value =
      "Header kısmı çözülemedi. JWT geçerli olmayabilir: " + e.message;
    return;
  }

  try {
    const payloadStr = base64UrlDecode(payloadPart);
    const payloadObj = JSON.parse(payloadStr);
    payloadJson.value = JSON.stringify(payloadObj, null, 2);
  } catch (e) {
    error.value =
      "Payload kısmı çözülemedi. JWT geçerli olmayabilir: " + e.message;
  }
}

function clearAll() {
  token.value = "";
  headerJson.value = "";
  payloadJson.value = "";
  error.value = "";
}
</script>
