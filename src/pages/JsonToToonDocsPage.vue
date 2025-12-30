<template>
  <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <header>
      <h1 class="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
        JSON to TOON Converter – Doküman
      </h1>
      <p class="text-slate-600 text-sm sm:text-base max-w-2xl">
        Bu sayfa, TOON formatının ne olduğunu, neden kullanıldığını ve Hesaplabs
        üzerindeki JSON → TOON dönüştürücüyü nasıl kullanabileceğini anlatır.
      </p>
    </header>

    <!-- Introduction -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-slate-900">TOON nedir?</h2>
      <p class="text-sm sm:text-base text-slate-700 leading-relaxed">
        TOON (Token-Oriented Object Notation), JSON verisini
        <strong>daha az token</strong> ile ifade etmeye odaklanan, metin tabanlı
        bir formattır. Özellikle yapay zeka / LLM (ChatGPT gibi) isteklerinde
        kullanmak için tasarlanmıştır.
      </p>
      <ul class="text-sm text-slate-700 list-disc pl-5 space-y-1">
        <li>JSON ile aynı veri modelini temsil eder (nesneler, diziler).</li>
        <li>
          Süslü parantez, tırnak ve tekrar eden key’ler gibi token israfını
          azaltır.
        </li>
        <li>İnsan tarafından da okunabilir; tablo gibi düzenlidir.</li>
      </ul>
    </section>

    <!-- Neden TOON? -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-slate-900">
        Neden TOON kullanılır?
      </h2>
      <ul class="text-sm sm:text-base text-slate-700 list-disc pl-5 space-y-1">
        <li>LLM API maliyetini düşürmek (daha az token → daha az ücret).</li>
        <li>
          Aynı context penceresine daha fazla veri sığdırmak (özellikle uzun
          loglar, raporlar, olay listeleri).
        </li>
        <li>JSON’dan daha kompakt ama CSV’den daha anlamlı bir yapı sunmak.</li>
      </ul>
    </section>

    <!-- Önce / Sonra örnek -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-slate-900">
        JSON ve TOON karşılaştırması
      </h2>

      <p class="text-sm text-slate-700">
        Basit bir <code>users</code> dizisini ele alalım:
      </p>

      <div
        class="grid md:grid-cols-2 gap-4 text-xs sm:text-sm font-mono text-slate-100"
      >
        <div class="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <div class="mb-2 text-[11px] text-emerald-300 font-semibold">
            JSON (geleneksel)
          </div>
          <pre>
{
  "users": [
    { "id": 1, "name": "Ada", "role": "admin" },
    { "id": 2, "name": "Can", "role": "user"  }
  ]
}</pre
          >
        </div>

        <div class="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <div class="mb-2 text-[11px] text-emerald-300 font-semibold">
            TOON (daha kompakt)
          </div>
          <pre>
users[2]{id,name,role}:
 1,Ada,admin
 2,Can,user</pre
          >
        </div>
      </div>

      <p class="text-[11px] sm:text-xs text-slate-500">
        Aynı veriyi temsil etmelerine rağmen TOON çıktısı çok daha kısadır ve
        LLM tarafında daha az token tüketir.
      </p>
    </section>

    <!-- Araç nasıl kullanılır -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-slate-900">
        Hesaplabs JSON → TOON aracı nasıl kullanılır?
      </h2>
      <ol
        class="text-sm sm:text-base text-slate-700 list-decimal pl-5 space-y-1"
      >
        <li>Sol taraftaki alana geçerli bir JSON yapıştır.</li>
        <li>
          <strong>Convert</strong> butonuna tıkla (veya klavyeden
          <code>Ctrl + Enter</code>).
        </li>
        <li>Sağ tarafta oluşan TOON çıktısını kopyala veya indir.</li>
        <li>
          İstersen karakter sayısı / tasarruf yüzdesi alanından yaklaşık
          küçülmeyi görebilirsin.
        </li>
      </ol>
      <p class="text-[11px] sm:text-xs text-slate-500">
        Dönüşüm tamamen tarayıcıda çalışır; verilerin sunucuya gönderilmez.
      </p>
    </section>

    <footer class="pt-4 border-t border-slate-200">
      <RouterLink
        to="/kodlama/json-to-toon-converter"
        class="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
      >
        Araca geri dön
      </RouterLink>
    </footer>
  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
