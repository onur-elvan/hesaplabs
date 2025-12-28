<template>
  <main class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
    <div
      class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6"
    >
      <!-- Basit bir tik işareti -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>

    <h1 class="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
      Mesajınız bize ulaştı! 🎉
    </h1>

    <p class="text-slate-600 mb-6">
      Geri bildiriminiz için teşekkür ederiz. Ekibimiz en kısa sürede size dönüş
      yapmaya çalışacak.
    </p>

    <p class="text-xs text-slate-500 mb-8">
      Bu sayfayı gördüyseniz mesajınız Netlify Forms üzerinden güvenli bir
      şekilde kaydedildi demektir.
    </p>

    <div class="flex flex-wrap justify-center gap-3">
      <router-link
        to="/"
        class="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        Ana sayfaya dön
      </router-link>

      <router-link
        to="/iletisim"
        class="inline-flex items-center px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
      >
        Yeni bir mesaj gönder
      </router-link>
    </div>
  </main>
</template>

<script setup>
// ekstra JS gerek yok
</script>
