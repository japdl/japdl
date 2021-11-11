<template>
  <div id="wrapper" class="w-full flex">
    <div class="w-full draggable"></div>
    <div id="minimize" @click="minimizeWindow" title="Minimiser la fenêtre">
      <Minimize class="icon hover:bg-gray-700" />
    </div>
    <div
      id="maximize"
      v-if="!maximized"
      @click="maximizeWindow"
      title="Maximiser la fenêtre"
    >
      <Maximize class="icon hover:bg-gray-700" />
    </div>
    <div id="restore" v-else @click="restoreWindow" title="Réduire la fenêtre">
      <Restore class="icon hover:bg-gray-700" />
    </div>
    <div id="close" @click="closeWindow" title="Fermer le programme">
      <Close class="icon hover:bg-red-600" />
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

const maximized = ref(false); // default window is not maximized
ipcRenderer.on("windowResize", (_event, arg) => (maximized.value = arg));

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

.icon {
  @apply cursor-pointer w-9 h-5 px-2;
}
</style>
