import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Telecharger from "../views/Telecharger.vue";
import Infos from "../views/Infos.vue";


const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/telecharger",
    name: "Telecharger",
    component: Telecharger,
  },
  {
    path: "/infos",
    name: "Infos",
    component: Infos,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;