import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/tailwind.css";
import "./assets/css/global.css";
import "typeface-roboto/index.css";

const app = createApp(App).use(router);

/**
 * v-scroll-to:
 * when mounted, the application will scroll the element into view
 */
app.directive("scroll-to", {
  mounted: (el) => {
    el.scrollIntoView({ behavior: "smooth" });
  },
});

app.mount("#app");
