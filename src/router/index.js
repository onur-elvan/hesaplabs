import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import CalculatorPage from "../pages/CalculatorPage.vue";
import AboutPage from "../pages/AboutPage.vue";
import JsonFormatterPage from "../pages/JsonFormatterPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";

const routes = [
  { path: "/", name: "home", component: HomePage },
  { path: "/c/:id", name: "calculator", component: CalculatorPage },
  { path: "/about", name: "about", component: AboutPage },
  {
    path: "/json-formatter",
    name: "json-formatter",
    component: JsonFormatterPage,
  },
  // 404 her zaman en sonda
  { path: "/:pathMatch(.*)*", name: "notfound", component: NotFoundPage },
];

export default createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes,
});
