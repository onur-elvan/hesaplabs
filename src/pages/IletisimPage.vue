<template>
  <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4">
      Bizimle İletişime Geçin
    </h1>

    <p class="text-slate-600 mb-8">
      Öneri, geri bildirim, hata bildirimi veya iş birliği için aşağıdaki formu
      kullanabilirsiniz. Mesajınız Netlify Forms üzerinden güvenli bir şekilde
      iletilir.
    </p>

    <!-- 🛡 Güçlendirilmiş Netlify Form -->
    <form
      name="iletisim"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      data-netlify-recaptcha="true"
      class="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4"
    >
      <!-- Netlify'nin formu tanıması için zorunlu -->
      <input type="hidden" name="form-name" value="iletisim" />

      <!-- Honeypot alan (gizli bot tuzağı) -->
      <p class="hidden">
        <label>
          Bot musun?
          <input name="bot-field" />
        </label>
      </p>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Adınız (isteğe bağlı)
          </label>
          <input
            name="name"
            type="text"
            class="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Adınızı buraya yazabilirsiniz"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">
            E-posta adresiniz <span class="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            class="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="ornek@mail.com"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Konu (isteğe bağlı)
          </label>
          <input
            name="subject"
            type="text"
            class="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Örn: Hata bildirimi, öneri, iş birliği..."
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Mesajınız <span class="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            rows="6"
            required
            class="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Bize iletmek istediğiniz her şeyi buraya yazabilirsiniz."
          ></textarea>
        </div>
      </div>

      <!-- 🧩 reCAPTCHA alanı (Netlify buraya widget ekliyor) -->
      <div class="pt-2">
        <div data-netlify-recaptcha="true"></div>
      </div>

      <div class="flex items-center justify-between pt-4">
        <p class="text-xs text-slate-500">
          Bu form üzerinden gönderdiğiniz bilgiler yalnızca size geri dönüş
          yapmak için kullanılır.
        </p>

        <button
          type="submit"
          class="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Gönder
        </button>
      </div>
    </form>
  </main>
</template>

<script setup>
// Ekstra JS zorunlu değil, Netlify HTML formu otomatik yakalıyor.
</script>
