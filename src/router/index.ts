import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Telecharger from "../views/Telecharger.vue";
import Infos from "../views/Infos.vue";
import Lecteur from "../views/Lecteur.vue";


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
  {
    path: "/lecteur",
    name: "Lecteur",
    component: Lecteur,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
