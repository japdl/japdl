<template>
  <li
    class="m-6 min-w-max flex flex-col gap-1 p-6 items-center mt-20 rounded-md shadow-2xl"
    :style="`background-color: ${backgroundColor};`"
  >
    <MangaImage class="w-40 self-center rounded-md" :manga="mangaName" />
    <h2 class="text-4xl font-manga text-center mt-2 text-white black-outline">
      {{ mangaName }}
    </h2>
    <BaseButton class="mt-3" @click="shell.openPath(folder.path)">
      Ouvrir le dossier
    </BaseButton>
    <BaseButton @click="shell.openExternal(mangaLink)">
      Voir sur japscan
    </BaseButton>
    <BaseButton class="mb-5" @click="downloadMore">Télécharger</BaseButton>
    <ol class="flex flex-col gap-0.5 max-h-96 overflow-y-auto">
      <MangaFile
        v-for="(file, ifile) in sortedFiles"
        :key="ifile"
        :file="file"
        :style="`color: ${midColor}`"
      />
    </ol>
  </li>
</template>

<script lang="ts" setup>
import fs from "fs";
import { defineProps } from "@vue/runtime-core";
import path from "path";
import { ipcRenderer, shell } from "electron";
import MangaFile from "./MangaFile.vue";
import MangaImage from "../MangaImage.vue";
import { computed, onUnmounted, ref } from "vue";
import router from "@/router";
import BaseButton from "../BaseButton.vue";

type File = {
  path: string;
  stat: fs.Stats;
};

const props = defineProps<{
  folder: File;
}>();

const mangaName = path.basename(props.folder.path);
const mangaLink = `https://www.japscan.ws/manga/${mangaName}/`;

const stringToColour = function (str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

function getMidColor(c1: string, c2: string) {
  let c = "#";
  for (let i = 0; i < 3; i++) {
    const sub1 = c1.substring(1 + 2 * i, 3 + 2 * i);
    const sub2 = c2.substring(1 + 2 * i, 3 + 2 * i);
    const v1 = parseInt(sub1, 16);
    const v2 = parseInt(sub2, 16);
    const v = Math.floor((v1 + v2) / 2);
    const sub = v.toString(16).toUpperCase();
    const padsub = ("0" + sub).slice(-2);
    c += padsub;
  }
  return c;
}

function getTextColorFromApp() {
  return window
    .getComputedStyle(document.querySelector("#app") as Element)
    .getPropertyValue("--text-color")
    .trim();
}

function calculateMidColor() {
  const textColor = getTextColorFromApp();
  const midColor = getMidColor(backgroundColor, textColor);
  console.log(mangaName, backgroundColor, ",", textColor, "=", midColor);

  return midColor;
}

const backgroundColor = stringToColour(mangaName);

const midColor = ref(calculateMidColor());

function changeThemeCallback() {
  midColor.value = calculateMidColor();
}

ipcRenderer.on("changeTheme", changeThemeCallback);

onUnmounted(() => {
  ipcRenderer.removeListener("changeTheme", changeThemeCallback);
});

ipcRenderer.send("log", ipcRenderer.listenerCount("changeTheme"));

const sortedFiles = computed(() => {
  var customSort = (a: { path: string }, b: { path: string }) => {
    const noNullMatch = (str: string) => {
      return (str.match(/(\d+)/g) ?? [0])[0];
    };
    return +noNullMatch(a.path) - +noNullMatch(b.path);
  };
  const fileTypeSort = (a: File, b: File) => {
    if (a.stat.isDirectory() && b.stat.isFile()) {
      return 1;
    }
    if (a.stat.isFile() && b.stat.isDirectory()) {
      return -1;
    }
    return 0;
  };
  return readdirSyncFullPath().sort(customSort).sort(fileTypeSort);
});

function readdirSyncFullPath() {
  try {
    return fs.readdirSync(props.folder.path).map((file) => {
      const filePath = path.join(props.folder.path, file);
      return { path: filePath, stat: fs.lstatSync(filePath) };
    });
  } catch (e) {
    return [];
  }
}

const downloadMore = () => {
  router.push({
    name: "Download",
    query: {
      manga: mangaName,
    },
  });
};
</script>

<style scoped>
.black-outline {
  text-shadow: rgb(0, 0, 0) 3px 0px 0px, rgb(0, 0, 0) 2.83487px 0.981584px 0px,
    rgb(0, 0, 0) 2.35766px 1.85511px 0px, rgb(0, 0, 0) 1.62091px 2.52441px 0px,
    rgb(0, 0, 0) 0.705713px 2.91581px 0px,
    rgb(0, 0, 0) -0.287171px 2.98622px 0px,
    rgb(0, 0, 0) -1.24844px 2.72789px 0px, rgb(0, 0, 0) -2.07227px 2.16926px 0px,
    rgb(0, 0, 0) -2.66798px 1.37182px 0px, rgb(0, 0, 0) -2.96998px 0.42336px 0px,
    rgb(0, 0, 0) -2.94502px -0.571704px 0px,
    rgb(0, 0, 0) -2.59586px -1.50383px 0px,
    rgb(0, 0, 0) -1.96093px -2.27041px 0px,
    rgb(0, 0, 0) -1.11013px -2.78704px 0px,
    rgb(0, 0, 0) -0.137119px -2.99686px 0px,
    rgb(0, 0, 0) 0.850987px -2.87677px 0px,
    rgb(0, 0, 0) 1.74541px -2.43999px 0px, rgb(0, 0, 0) 2.44769px -1.73459px 0px,
    rgb(0, 0, 0) 2.88051px -0.838247px 0px;
}
</style>
