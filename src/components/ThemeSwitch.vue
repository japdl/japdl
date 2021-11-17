<template>
  <div id="themeButton">
    <div
      id="svgs"
      class="flex justify-center items-center relative py-1 hover:background"
    >
      <Sun
        v-if="selectedTheme == 'dark'"
        ref="sun"
        src="../assets/svg/sun.svg"
        alt="sun"
        class="topbar-icon w-full"
        @click="setTheme('light')"
      />
      <Moon
        v-if="selectedTheme == 'light'"
        ref="moon"
        src="../assets/svg/moon.svg"
        alt="moon"
        class="topbar-icon w-full"
        @click="setTheme('dark')"
      />
    </div>
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
