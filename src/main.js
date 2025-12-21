import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router";

createApp(App).use(router).mount("#app");
// src/main.js (router oluşturulduktan sonra EKLE)
router.afterEach((to) => {
  // GA4 yüklü değilse patlamasın
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: to.fullPath,
  });
});
