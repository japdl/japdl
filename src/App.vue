<template>
  <div id="container" class="full flex flex-col">
    <TopBar />
    <main class="flex">
      <SideBar class="fit-side" />
      <div id="content" class="w-full">
        <NavBar class="w-full" />
        <div id="view" class="fit-screen overflow-y-scroll">
          <img
            :src="torii"
            class="mx-auto w-32 my-4 transition-all duration-200"
            :class="{
              loading,
            }"
          />
          <router-view></router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { ref } from "vue";
import { provide } from "@vue/runtime-core";
import NavBar from "./components/NavBar.vue";
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar/SideBar.vue";
import { loading } from "@/utils/loadingState";
//@ts-expect-error this is not a typescript file, typescript
import torii from "./assets/svg/noun-torii.svg";

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
const platform = ipcRenderer.sendSync("process", "platform");
provide("platform", platform);
</script>

<style scoped>
.loading {
  @apply p-2 animate-spin;
}
</style>
