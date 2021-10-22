import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const makeRoute = (path: string, name?: string) => {
  const upperCaseFirstLetter = (str: string): string => {
    const splitted = str.split("");
    splitted[0] = splitted[0].toUpperCase();
    return splitted.join("");
  };
  const vueModuleName = `${upperCaseFirstLetter(path)}`;
  const routeName = name ? name : vueModuleName;
  return {
    path: "/" + path,
    name: routeName,
    component: () => import(`../views/${vueModuleName}.vue`),
  } as RouteRecordRaw;
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Accueil",
    component: Home,
  },
  makeRoute("download", "Télécharger un manga"),
  makeRoute("downloaded", "Mangas téléchargés"),
  makeRoute("infos", "Informations sur un manga"),
  makeRoute("about", "À propos"),
  makeRoute("tests"),
  makeRoute("options"),
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
