<template>
  <div v-if="notReady">
    <TopBar />
    <div>
      {{ notReady }}
    </div>
  </div>
  <div v-else class="w-full h-full flex flex-col justify-between">
    <TopBar />
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
import { ref } from "vue";
import { provide } from "@vue/runtime-core";
import StatusFooter from "./components/Footer/StatusFooter.vue";
import NavBar from "./components/NavBar.vue";
import TopBar from "./components/TopBar.vue";

const notReady = ref(false);
ipcRenderer.send("readyStatus");
ipcRenderer.on("readyStatusResponse", (event, arg) => (notReady.value = arg));

// if japscan initialisation takes time, it may be used
ipcRenderer.on("ready", () => (notReady.value = false));

const appElement = document.getElementById("app") as HTMLDivElement;
console.log("Sending set theme");
ipcRenderer.send("getTheme");
ipcRenderer.on("changeTheme", (event, data) => {
  console.log("Changing theme to " + data);
  appElement.classList.remove("light", "dark");
  appElement.classList.add(data);
});

const debug = ipcRenderer.sendSync("debug");
provide("debug", debug);
</script>

<style scoped>
main {
  padding: 15px 5px 10px 5px;
  background-color: var(--light-background);
}
</style>
