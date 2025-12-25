<template>
  <header class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="group flex items-center gap-3">
        <img
          :src="logo"
          alt="hesaplabs logo"
          class="h-12 sm:h-14 md:h-16 w-auto transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-1"
        />
        <span class="sr-only">hesaplabs</span>
      </RouterLink>

      <!-- Desktop Menü -->
      <nav class="hidden md:flex items-center gap-6 text-sm">
        <RouterLink to="/" class="hover:text-blue-600 transition">
          Hesaplayıcılar
        </RouterLink>
        <RouterLink to="/json-formatter" class="hover:text-blue-600 transition">
          JSON Formatter
        </RouterLink>

        <!-- Yakında: Yapay Zeka -->
        <span
          class="relative text-gray-400 cursor-not-allowed select-none"
          title="Yakında geliyor"
        >
          Yapay Zeka
          <span
            class="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600"
          >
            yakında
          </span>
        </span>

        <!-- Yakında: Döviz / Finans -->
        <RouterLink
          to="/piyasalar"
          class="hover:text-blue-600 transition flex items-center gap-1"
        >
          Piyasalar
          <span
            class="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600"
          >
            beta
          </span>
        </RouterLink>

        <RouterLink to="/about" class="hover:text-blue-600 transition">
          Hakkında
        </RouterLink>
      </nav>

      <!-- Mobile Menü Butonu -->
      <button
        class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border bg-white hover:shadow active:scale-[0.99] transition"
        @click="toggleMenu"
        :aria-expanded="isOpen ? 'true' : 'false'"
        aria-label="Menüyü aç/kapat"
      >
        <!-- Hamburger / X -->
        <svg
          v-if="!isOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Overlay -->
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50" @click.self="closeMenu">
        <!-- Koyu arkaplan -->
        <div class="absolute inset-0 bg-black/40"></div>

        <!-- Drawer -->
        <transition name="slideDown">
          <div
            class="absolute left-0 right-0 top-0 bg-white border-b shadow-lg"
          >
            <div class="max-w-7xl mx-auto px-4 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <img :src="logo" alt="hesaplabs logo" class="h-10 w-auto" />
                  <div class="text-sm font-semibold text-gray-800">Menü</div>
                </div>

                <button
                  class="inline-flex items-center justify-center w-10 h-10 rounded-lg border bg-white hover:shadow active:scale-[0.99] transition"
                  @click="closeMenu"
                  aria-label="Kapat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div class="flex flex-col gap-4 text-sm">
                <RouterLink to="/" @click="closeMenu">
                  Hesaplayıcılar
                </RouterLink>
                <RouterLink to="/json-formatter" @click="closeMenu">
                  JSON Formatter
                </RouterLink>

                <div class="text-gray-400">
                  Yapay Zeka
                  <span
                    class="ml-2 text-[10px] bg-gray-200 px-2 py-0.5 rounded"
                  >
                    yakında
                  </span>
                </div>

                <RouterLink
                  to="/piyasalar"
                  @click="closeMenu"
                  class="flex items-center gap-2"
                >
                  <span>Piyasalar</span>
                  <span class="text-[10px] bg-gray-200 px-2 py-0.5 rounded">
                    beta
                  </span>
                </RouterLink>

                <RouterLink to="/about" @click="closeMenu">
                  Hakkında
                </RouterLink>
              </div>

              <div class="mt-4 text-xs text-gray-500">
                © {{ new Date().getFullYear() }} hesaplabs
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import logo from "../assets/yazili_logo.png";

const route = useRoute();
const isOpen = ref(false);

function openMenu() {
  isOpen.value = true;
}
function closeMenu() {
  isOpen.value = false;
}
function toggleMenu() {
  isOpen.value ? closeMenu() : openMenu();
}

// Route değişince menüyü kapat
watch(
  () => route.path,
  () => {
    closeMenu();
  }
);

// Scroll kilidi (menü açıkken)
watch(isOpen, (v) => {
  document.body.style.overflow = v ? "hidden" : "";
});
</script>

<style scoped>
/* Desktop link animasyonu */
.nav-link {
  position: relative;
  padding: 4px 2px;
  color: #374151;
  transition: color 0.2s ease, transform 0.2s ease;
}
.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 2px;
  background-color: #2563eb;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}
.nav-link:hover {
  color: #2563eb;
  transform: translateY(-1px);
}
.nav-link:hover::after {
  transform: scaleX(1);
}
.nav-link.active {
  color: #2563eb;
  font-weight: 600;
}
.nav-link.active::after {
  transform: scaleX(1);
}

/* Mobile link */
.mobile-link {
  padding: 12px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  color: #111827;
  font-weight: 500;
  transition: transform 0.15s ease, box-shadow 0.15s ease,
    border-color 0.15s ease;
}
.mobile-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  border-color: #cbd5e1;
}
.mobile-link.active {
  border-color: #2563eb;
  box-shadow: 0 10px 26px rgba(37, 99, 235, 0.15);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slideDown-enter-active {
  transition: transform 0.22s ease, opacity 0.22s ease;
}
.slideDown-leave-active {
  transition: transform 0.18s ease, opacity 0.18s ease;
}
.slideDown-enter-from,
.slideDown-leave-to {
  transform: translateY(-12px);
  opacity: 0;
}
</style>
