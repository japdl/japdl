<template>
  <SideBar class="pt-20 w-64 fixed" />
  <div id="top" class="h-16 fixed w-full z-50">
    <TopBar class="w-full" />
    <NavBar class="w-full" />
  </div>
  <main class="pt-20 pl-64 overflow-y-auto">
    <img src="./assets/svg/noun-torii.svg" class="w-32 mx-auto" />
    <router-view></router-view>
  </main>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { ref } from "vue";
import { provide } from "@vue/runtime-core";
import NavBar from "./components/NavBar.vue";
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar/SideBar.vue";

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

