import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/tailwind.css";
import "./assets/css/global.css";
import "typeface-roboto/index.css";

createApp(App).use(router).mount("#app");
