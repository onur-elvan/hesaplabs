// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../pages/HomePage.vue";
import CalculatorPage from "../pages/CalculatorPage.vue";
import AboutPage from "../pages/AboutPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import IletisimPage from "../pages/IletisimPage.vue";
import IletisimTesekkurPage from "../pages/IletisimTesekkurPage.vue";

// Yeni eklediğimiz sayfalar
import KodlamaAraclariPage from "../pages/KodlamaAraclariPage.vue";
import CodeToolPage from "../pages/CodeToolPage.vue";

const routes = [
  // Ana sayfa
  { path: "/", name: "home", component: HomePage },

  // Hesaplayıcı detay sayfası
  { path: "/c/:id", name: "calculator", component: CalculatorPage },

  // Hakkında
  { path: "/about", name: "about", component: AboutPage },

  // İletişim
  {
    path: "/iletisim",
    name: "iletisim",
    component: IletisimPage,
    meta: {
      title: "İletişim | Hesaplabs",
      description:
        "Hesaplabs ile ilgili soru, öneri ve iş birlikleri için bizimle iletişime geçin. Geri bildirimlerinizle hesaplama araçlarımızı geliştirmemize yardımcı olun.",
    },
  },
  // İletişim sonrası teşekkür sayfası
  {
    path: "/iletisim-tesekkur",
    name: "iletisim-tesekkur",
    component: IletisimTesekkurPage,
    meta: {
      title: "Teşekkürler | Hesaplabs",
      description:
        "Mesajınız başarıyla alındı. Hesaplabs ekibi en kısa sürede size geri dönüş yapacaktır.",
    },
  },

  // 🔹 Kodlama araçları listesi (JSON formatter, Base64, URL encode vs.)
  {
    path: "/kodlama-araclari",
    name: "code-tools",
    component: KodlamaAraclariPage,
    meta: {
      title:
        "Kodlama Araçları | JSON Formatter, Base64, URL Encode | Hesaplabs",
      description:
        "JSON formatter, Base64 encode/decode, URL encode/decode ve daha fazlası. Geliştiriciler için ücretsiz kodlama ve formatlama araçları.",
    },
  },

  // 🔹 Her bir kodlama aracı için dinamik detay sayfası
  // Örn: /kodlama/base64, /kodlama/json-formatter, /kodlama/url-encoder
  {
    path: "/kodlama/:slug",
    name: "code-tool-detail",
    component: CodeToolPage,
    meta: {
      title: "Kodlama Aracı | Hesaplabs",
    },
  },

  // Eski /json-formatter linkleri bozulmasın diye redirect
  {
    path: "/json-formatter",
    redirect: { name: "code-tool-detail", params: { slug: "json-formatter" } },
  },

  // 404 her zaman en sonda
  { path: "/:pathMatch(.*)*", name: "notfound", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes,
});

// Basit SEO: route meta'sına göre title + description güncelle
router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }

  const descTag = document.querySelector('meta[name="description"]');
  if (descTag && to.meta && to.meta.description) {
    descTag.setAttribute("content", to.meta.description);
  }
});

export default router;
