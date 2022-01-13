<template>
  <div id="themeButton" class="flex justify-center items-center py-1">
    <Sun
      v-if="selectedTheme == 'dark'"
      ref="sun"
      src="../assets/svg/sun.svg"
      alt="sun"
      class="full"
      @click="setTheme('light')"
    />
    <Moon
      v-if="selectedTheme == 'light'"
      ref="moon"
      src="../assets/svg/moon.svg"
      alt="moon"
      class="full"
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

const setTheme = (theme: "dark" | "light") =>
  ipcRenderer.send("setTheme", theme);

ipcRenderer.send("getTheme");
ipcRenderer.on("changeTheme", (event, arg) => (selectedTheme.value = arg));
</script>

<style scoped></style>
