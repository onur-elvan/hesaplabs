<template>
  <footer class="bg-gray-100 mt-16 border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-600">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <!-- LEFT -->
        <div>
          © {{ new Date().getFullYear() }} Hesaplabs — Tüm hakları saklıdır
        </div>

        <!-- RIGHT -->
        <nav class="flex items-center gap-4">
          <RouterLink to="/gizlilik-politikasi" class="hover:text-gray-900">
            Gizlilik Politikası
          </RouterLink>

          <RouterLink to="/cerez-politikasi" class="hover:text-gray-900">
            Çerez Politikası
          </RouterLink>

          <RouterLink to="/iletisim" class="hover:text-gray-900">
            İletişim
          </RouterLink>
        </nav>
      </div>
    </div>
  </footer>
</template>
