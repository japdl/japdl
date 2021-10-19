<template>
  <div class="h-full w-full flex flex-col justify-between">
    <NavBar />
    <main class="overflow-y-scroll h-full">
      <div id="image-container" class="flex justify-center">
        <img class="w-32" src="./assets/svg/noun-torii.svg" />
      </div>
      <router-view />
    </main>
    <StatusFooter />
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import StatusFooter from "./components/Footer/StatusFooter.vue";
import NavBar from "./components/NavBar.vue";

const appElement = document.getElementById("app") as HTMLDivElement;
console.log("Sending set theme");
ipcRenderer.send("getTheme");
ipcRenderer.on("changeTheme", (event, data) => {
  console.log("Changing theme to " + data);
  appElement.classList.remove("light", "dark");
  appElement.classList.add(data);
});
</script>

<style scoped>
main {
  padding: 15px 5px 10px 5px;
  background-color: var(--light-background);
}
</style>
