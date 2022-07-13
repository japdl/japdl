import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

const importView = (viewName: string) => {
  return () => import(`../views/${capitalize(viewName)}.vue`);
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    //alias: "Accueil",
    component: Home,
  },
  {
    path: "/download",
    props: (route) => ({
      query: route.query,
    }),
    name: "Download",
    //alias: "Télécharger un manga",
    component: importView("download"),
  },
  {
    path: "/choose",
    name: "Choose",
    //alias: "Choisir un manga",
    component: importView("choose"),
  },
  {
    path: "/downloaded",
    name: "Downloaded",
    //alias: "Mangas téléchargés",
    component: importView("downloaded"),
  },
  /*   {
    path: "/reader",
    name: "Reader",
    component: importView("reader"),
  }, */
  {
    path: "/options",
    name: "Options",
    //alias: "Options",
    component: importView("options"),
  },
  {
    path: "/transfer",
    name: "Transfer",
    component: importView("transfer"),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
