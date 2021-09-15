<template>
  <nav>
    <router-link
      v-for="route in clickableRoutes"
      :key="route.name"
      :to="route.path"
      >{{ route.name }}
    </router-link>
  </nav>
  <main>
    <div id="image-container" class="flex justify-center">
      <img class="w-32" src="./assets/noun-torii.svg" />
    </div>
    <router-view />
  </main>
  <StatusFooter />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import route from "@/router";
import { ipcRenderer } from "electron";
import StatusFooter from "./components/Footer/StatusFooter.vue";
const routes = ref(
  route.getRoutes().map(({ name, path }) => ({ name: name as string, path }))
);

const appElement = document.getElementById("app") as HTMLDivElement;
console.log("Sending set theme");
ipcRenderer.send("getTheme");
ipcRenderer.on("changeTheme", (event, data) => {
  console.log("Changing theme to " + data);
  appElement.classList.remove("light", "dark");
  appElement.classList.add(data);
});

const clickableRoutes = computed(() =>
  routes.value.filter((route) => route.name)
);
</script>

<style scoped>
nav {
  grid-area: header;
  display: flex;
  height: 80px;
  background-color: var(--dark-background);
  width: 100%;
  justify-content: space-evenly;
  align-items: unset;
}

nav a {
  text-decoration: none;
  display: flex;
  font-weight: bold;
  color: var(--text-color);
  border: 1px solid black;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
nav a.router-link-exact-active {
  color: var(--dark-primary);
}
nav a:hover {
  color: var(--primary);
  background-image: linear-gradient(
    to bottom left,
    var(--light-background),
    var(--dark-background)
  );
}

main {
  grid-area: main;
  padding: 15px 5px 10px 5px;
  background-color: var(--light-background);
}

footer {
  grid-area: footer;
  overflow-y: scroll;
  max-height: 200px;
}
</style>
