<template>
  <!-- Sadece hesaplayıcı kartı, menü vs yok -->
  <main class="max-w-xl mx-auto px-4 py-4">
    <section v-if="calculator">
      <h1 class="text-lg font-semibold text-slate-900 mb-3">
        {{ calculator.name }}
      </h1>

      <!-- Buraya CalculatorPage’de kullandığın hesaplama formunu
           komponent olarak kullanabilirsin. Örnek: -->
      <component :is="calculator.component" />
    </section>

    <section v-else class="text-center text-slate-500 text-sm">
      Hesaplayıcı bulunamadı.
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { calculators } from "../registry/calculators"; // sende neredeyse

const route = useRoute();

const calculator = computed(() =>
  calculators.find((c) => c.id === route.params.id)
);
</script>

<style>
/* Embed içi arka planı beyaz yap, gri bir sitede bile temiz dursun */
body {
  background-color: #ffffff;
}
</style>
