// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../pages/HomePage.vue";
import CalculatorPage from "../pages/CalculatorPage.vue";
import AboutPage from "../pages/AboutPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import IletisimPage from "../pages/IletisimPage.vue";
import IletisimTesekkurPage from "../pages/IletisimTesekkurPage.vue";
import EmbedCalculatorPage from "../pages/EmbedCalculatorPage.vue";
import JsonToToonDocsPage from "../pages/JsonToToonDocsPage.vue";
import CerezPolitikasiPage from "../pages/CerezPolitikasiPage.vue";

// Yeni eklediğimiz sayfalar
import KodlamaAraclariPage from "../pages/KodlamaAraclariPage.vue";
import CodeToolPage from "../pages/CodeToolPage.vue";

const routes = [
  // 🏠 Ana sayfa
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: {
      title: "Hesaplabs — Akıllı Hesaplama Araçları",
      description:
        "Finans, eğitim, matematik ve günlük hayat için ücretsiz, hızlı ve mobil uyumlu hesaplayıcılar. Hesaplabs ile karmaşık hesapları saniyeler içinde çözün.",
    },
  },

  // 🔢 Hesaplayıcı detay sayfası
  // Başlık/description burada CalculatorPage içindeki useSeo ile ayarlanıyor.
  {
    path: "/c/:id",
    name: "calculator",
    component: CalculatorPage,
  },

  // ℹ️ Hakkında
  {
    path: "/about",
    name: "about",
    component: AboutPage,
    meta: {
      title: "Hakkında | Hesaplabs",
      description:
        "Hesaplabs nedir, nasıl ortaya çıktı ve hangi problemleri çözmeyi hedefliyor? Projenin hikayesini ve vizyonunu öğrenin.",
    },
  },

  // 📩 İletişim
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

  // ✅ İletişim sonrası teşekkür sayfası
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

  // 🧰 Kodlama araçları listesi (JSON formatter, Base64, URL encode vs.)
  {
    path: "/kodlama-araclari",
    name: "code-tools",
    component: KodlamaAraclariPage,
    meta: {
      title:
        "Kodlama Araçları | JSON Formatter, Base64, URL Encode | Hesaplabs",
      description:
        "JSON formatter, Base64 encode/decode, URL encode/decode, JWT decoder, UUID üretici ve daha fazlası. Geliştiriciler için ücretsiz kodlama ve formatlama araçları.",
    },
  },

  // 🔧 Her bir kodlama aracı için dinamik detay sayfası
  {
    path: "/kodlama/:slug",
    name: "code-tool-detail",
    component: CodeToolPage,
    meta: {
      title: "Kodlama Aracı | Hesaplabs",
      description:
        "JSON, metin ve web geliştirme için yardımcı kodlama araçlarını kullanın. Formatter, encoder, decoder ve daha fazlası.",
    },
  },

  // Eski /json-formatter linkleri bozulmasın diye redirect
  {
    path: "/json-formatter",
    redirect: { name: "code-tool-detail", params: { slug: "json-formatter" } },
  },

  // 🔗 Embed için sade sürüm
  {
    path: "/embed/c/:id",
    name: "embed-calculator",
    component: EmbedCalculatorPage,
    meta: {
      title: "Hesaplayıcı | Embed | Hesaplabs",
      description:
        "Bu hesaplayıcıyı iframe ile kendi sitenize gömerek kullanabilirsiniz. Hesaplabs altyapısı üzerinde çalışır.",
    },
  },

  // 📘 JSON to TOON doküman sayfası
  {
    path: "/kodlama/json-to-toon-bilgi",
    name: "json-to-toon-docs",
    component: JsonToToonDocsPage,
    meta: {
      title: "JSON to TOON Converter Dokümanı | Hesaplabs",
      description:
        "TOON formatının ne olduğunu, neden kullanıldığını ve JSON to TOON converter aracını nasıl kullanacağınızı anlatan detaylı doküman.",
    },
  },

  // 🔐 Gizlilik Politikası
  {
    path: "/gizlilik-politikasi",
    name: "privacy",
    component: () => import("../pages/GizlilikPolitikasi.vue"),
    meta: {
      title: "Gizlilik Politikası | Hesaplabs",
      description:
        "Hesaplabs olarak kişisel verilerinizi nasıl işlediğimizi, sakladığımızı ve koruduğumuzu açıklayan gizlilik politikası.",
    },
  },

  // 🍪 Çerez Politikası
  {
    path: "/cerez-politikasi",
    name: "cookie-policy",
    component: CerezPolitikasiPage,
    meta: {
      title: "Çerez Politikası | Hesaplabs",
      description:
        "Sitemizde kullanılan çerez türlerini, hangi amaçlarla kullanıldıklarını ve çerez tercihlerinizi nasıl yönetebileceğinizi öğrenin.",
    },
  },

  // 404 her zaman en sonda
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: NotFoundPage,
    meta: {
      title: "404 — Sayfa Bulunamadı | Hesaplabs",
      description:
        "Aradığınız sayfa bulunamadı veya taşınmış olabilir. Hesaplabs ana sayfasına dönerek hesaplama araçlarını keşfedebilirsiniz.",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes,
});

// 🌐 Basit SEO: route meta'sına göre title + description güncelle
router.afterEach((to) => {
  const defaultTitle = "Hesaplabs — Akıllı Hesaplama Araçları";
  const defaultDesc =
    "Finans, eğitim, matematik ve günlük hayat için ücretsiz, hızlı ve mobil uyumlu hesaplayıcılar.";

  // Title
  document.title = to.meta?.title || defaultTitle;

  // Description
  const descTag = document.querySelector('meta[name="description"]');
  if (descTag) {
    descTag.setAttribute("content", to.meta?.description || defaultDesc);
  }
});

export default router;
