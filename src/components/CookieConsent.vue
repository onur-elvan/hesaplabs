<template>
  <transition name="fade">
    <div
      v-if="!choiceMade"
      class="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg bg-white border rounded-2xl shadow-lg p-4 sm:p-5 z-50"
    >
      <h3 class="font-semibold text-slate-900 text-sm mb-2">
        Gizlilik ve Çerez Kullanımı
      </h3>

      <p class="text-xs text-slate-600 leading-relaxed">
        Deneyimini iyileştirmek ve istatistiksel analizler yapmak için çerezler
        kullanıyoruz. Sitemizi kullanarak
        <RouterLink to="/gizlilik-politikasi" class="text-blue-600 underline">
          Gizlilik Politikamızı
        </RouterLink>
        kabul etmiş olursun.
      </p>

      <div class="flex justify-end gap-2 mt-3">
        <button
          class="px-3 py-1.5 text-xs rounded-lg border hover:bg-slate-50"
          @click="reject"
        >
          Reddet
        </button>

        <button
          class="px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          @click="accept"
        >
          Kabul Et
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";

const choiceMade = ref(false);

onMounted(() => {
  const stored = localStorage.getItem("cookie-consent");
  if (stored === "accepted" || stored === "rejected") {
    choiceMade.value = true;
  }
});

function accept() {
  localStorage.setItem("cookie-consent", "accepted");
  choiceMade.value = true;
}

function reject() {
  localStorage.setItem("cookie-consent", "rejected");
  choiceMade.value = true;
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
