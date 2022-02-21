<template>
  <div
    id="themeButton"
    class="flex justify-center items-center py-1"
    @click="switchTheme()"
  >
    <Sun
      v-if="selectedTheme == 'dark'"
      ref="sun"
      src="../assets/svg/sun.svg"
      alt="sun"
      @click="setTheme('light')"
    />
    <Moon
      v-if="selectedTheme == 'light'"
      ref="moon"
      src="../assets/svg/moon.svg"
      alt="moon"
      @click="setTheme('dark')"
    />
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { ref } from "vue";
import Moon from "./Images/Moon.vue";
import Sun from "./Images/Sun.vue";

const selectedTheme = ref("dark");
type Theme = "dark" | "light";

const switchTheme = () => {
  if (selectedTheme.value == "dark") {
    selectedTheme.value = "light";
  } else {
    selectedTheme.value = "dark";
  }
  setTheme(selectedTheme.value as Theme);
};

const setTheme = (theme: Theme) => ipcRenderer.send("setTheme", theme);

ipcRenderer.send("getTheme");
ipcRenderer.setMaxListeners(0);
ipcRenderer.on("changeTheme", (event, arg) => (selectedTheme.value = arg));
</script>
