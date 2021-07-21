import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Download from "../views/Download.vue";
import Infos from "../views/Infos.vue";
import Tests from "../views/Tests.vue";
import Options from "../views/Options.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Accueil",
    component: Home,
  },

  {
    path: "/download",
    name: "Télécharger un manga",
    component: Download,
  },
  {
    path: "/infos",
    name: "Informations sur un manga",
    component: Infos,
  },
  {
    path: "/about",
    name: "À propos",
    component: About,
  },
  {
    path: "/tests",
    name: "Tests",
    component: Tests,
  },
  {
    path: "/options",
    name: "Options",
    component: Options,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
