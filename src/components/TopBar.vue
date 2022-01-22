<template>
  <div id="wrapper" class="w-full h-10 flex select-none">
    <div class="w-full draggable"></div>
    <div class="flex justify-center items-center">
      <ThemeSwitch class="topbar-icon hover:bg-dark-background" />
      <Minimize
        @click="minimizeWindow"
        title="Minimiser la fenêtre"
        class="topbar-icon hover:bg-dark-background"
      />
      <Maximize
        v-if="!maximized"
        @click="maximizeWindow"
        title="Maximiser la fenêtre"
        class="topbar-icon hover:bg-dark-background"
      />
      <Restore
        v-else
        @click="restoreWindow"
        title="Réduire la fenêtre"
        class="topbar-icon hover:bg-dark-background"
      />
      <Close
        @click="closeWindow"
        title="Fermer le programme"
        class="topbar-icon hover:bg-red-600"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Minimize from "./Images/Minimize.vue";
import Maximize from "./Images/Maximize.vue";
import Restore from "./Images/Restore.vue";
import Close from "./Images/Close.vue";
import { ipcRenderer } from "electron";
import { ref } from "vue";
import ThemeSwitch from "./ThemeSwitch.vue";

const maximized = ref(false); // default window is not maximized
ipcRenderer.on("windowResize", (_event, arg) =>
  console.log("maximized?: ", (maximized.value = arg))
);

const minimizeWindow = () => ipcRenderer.send("minimizeWindow");
const maximizeWindow = () => ipcRenderer.send("maximizeWindow");
const restoreWindow = () => ipcRenderer.send("restoreWindow");
const closeWindow = () => ipcRenderer.send("closeWindow");
</script>

<style scoped>
#wrapper {
  background-color: var(--container);
}
.draggable {
  -webkit-user-select: none;
  user-select: none;
  -webkit-app-region: drag;
}

.topbar-icon {
  @apply cursor-pointer w-10 px-2 h-full;
}
</style>
