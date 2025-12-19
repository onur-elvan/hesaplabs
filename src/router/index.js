import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import CalculatorPage from "../pages/CalculatorPage.vue";
import AboutPage from "../pages/AboutPage.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/c/:id", name: "calculator", component: CalculatorPage },
    { path: "/about", name: "about", component: AboutPage },
  ],
});
