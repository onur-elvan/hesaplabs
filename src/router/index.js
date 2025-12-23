import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import CalculatorPage from "../pages/CalculatorPage.vue";
import AboutPage from "../pages/AboutPage.vue";

// yoksa ben yazacağım
import NotFoundPage from "../pages/NotFoundPage.vue";

export default createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/c/:id", name: "calculator", component: CalculatorPage },
    { path: "/about", name: "about", component: AboutPage },

    // 404
    { path: "/:pathMatch(.*)*", name: "notfound", component: NotFoundPage },
  ],
});
