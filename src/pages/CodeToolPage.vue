<template>
  <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section v-if="tool">
      <h1 class="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
        {{ tool.name }}
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
import { computed } from "vue";
import { useRoute } from "vue-router";
import { codeTools } from "../data/codeTools";

import JsonFormatterTool from "../tools/JsonFormatterTool.vue";
import Base64Tool from "../tools/Base64Tool.vue";
import UrlEncodeTool from "../tools/UrlEncodeTool.vue";
import JsonDiffTool from "../tools/JsonDiffTool.vue";
import JwtDecoderTool from "../tools/JwtDecoderTool.vue";
import UuidTool from "../tools/UuidTool.vue";

// import UrlEncoderTool from "../tools/UrlEncoderTool.vue";

const route = useRoute();

const mapSlugToComponent = {
  "json-formatter": JsonFormatterTool,
  "base64-encoder-decoder": Base64Tool,
  "url-encoder-decoder": UrlEncodeTool,
  "uuid-generator": UuidTool,
  "json-compare": JsonDiffTool,
  "jwt-decoder": JwtDecoderTool,
  //   "url-encoder-decoder": UrlEncoderTool,
};

const tool = computed(() =>
  codeTools.find((t) => t.slug === route.params.slug)
);

const toolComponent = computed(() => {
  if (!tool.value) return null;
  return mapSlugToComponent[tool.value.slug] || null;
});

// SEO: route'a girince meta'ları güncelle
if (tool.value) {
  document.title = tool.value.metaTitle;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) {
    desc.setAttribute("content", tool.value.metaDescription);
  }
}
</script>
