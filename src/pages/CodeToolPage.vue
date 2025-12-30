<template>
  <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section v-if="tool">
      <!-- Başlık + i butonu -->
      <h1
        class="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2 flex items-center gap-2"
      >
        <span>{{ tool.name }}</span>

        <!-- Doküman sayfası varsa küçük "i" butonu -->
        <RouterLink
          v-if="tool.docsRoute"
          :to="tool.docsRoute"
          class="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100"
          title="Detaylı bilgiyi gör"
          aria-label="Detaylı bilgiyi gör"
        >
          i
        </RouterLink>
      </h1>

      <p class="text-slate-600 text-sm sm:text-base max-w-2xl mb-6">
        {{ tool.shortDescription }}
      </p>

      <!-- Küçük etiketler -->
      <div class="flex flex-wrap gap-2 mb-6 text-xs">
        <span class="px-2 py-1 rounded-full bg-blue-50 text-blue-700">
          {{ tool.category }}
        </span>
        <span class="px-2 py-1 rounded-full bg-slate-100 text-slate-700">
          Zorluk: {{ tool.difficulty }}
        </span>
      </div>

      <!-- Asıl araç bileşeni -->
      <component :is="toolComponent" />
    </section>

    <section v-else>
      <p class="text-slate-600">Bu kodlama aracı bulunamadı.</p>
    </section>
  </main>
</template>

<script setup>
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { codeTools } from "../data/codeTools";

import JsonFormatterTool from "../tools/JsonFormatterTool.vue";
import Base64Tool from "../tools/Base64Tool.vue";
import UrlEncodeTool from "../tools/UrlEncodeTool.vue";
import JsonDiffTool from "../tools/JsonDiffTool.vue";
import JwtDecoderTool from "../tools/JwtDecoderTool.vue";
import UuidTool from "../tools/UuidTool.vue";
import JsonToToonTool from "../tools/JsonToToonTool.vue";

const route = useRoute();

const mapSlugToComponent = {
  "json-formatter": JsonFormatterTool,
  "base64-encoder-decoder": Base64Tool,
  "url-encoder-decoder": UrlEncodeTool,
  "uuid-generator": UuidTool,
  "json-compare": JsonDiffTool,
  "jwt-decoder": JwtDecoderTool,
  "json-to-toon-converter": JsonToToonTool,
};

const tool = computed(() =>
  codeTools.find((t) => t.slug === route.params.slug)
);

const toolComponent = computed(() => {
  if (!tool.value) return null;
  return mapSlugToComponent[tool.value.slug] || null;
});

/**
 * Basit SEO: ilgili araca göre title + description güncelle.
 * Route değiştiğinde yeniden çalışsın diye watchEffect kullandık.
 */
watchEffect(() => {
  if (tool.value) {
    document.title = tool.value.metaTitle || tool.value.name + " | Hesaplabs";

    const desc = document.querySelector('meta[name="description"]');
    if (desc && tool.value.metaDescription) {
      desc.setAttribute("content", tool.value.metaDescription);
    }
  } else {
    document.title = "Kodlama Araçları | Hesaplabs";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        "content",
        "JSON formatter, Base64, URL encode/decode ve daha fazlası için ücretsiz kodlama araçları."
      );
    }
  }
});
</script>
