<template>
  <li
    class="m-6 min-w-max flex flex-col gap-1 p-6 items-center mt-20 rounded-md"
    :style="`background-color: ${backgroundColor};`"
  >
    <img :src="imageLink" id="mangaImage" class="w-40 self-center" />
    <h2 class="text-4xl font-manga text-center mt-2 text-white black-outline">
      {{ mangaName }}
    </h2>
    <button class="basic mt-3" @click="shell.openPath(folder.path)">
      Ouvrir le dossier
    </button>
    <button class="basic" @click="shell.openExternal(mangaLink)">
      Voir sur japscan
    </button>
    <button class="basic mb-5" @click="downloadMore">Télécharger</button>
    <ol class="flex flex-col gap-0.5 max-h-96 overflow-y-auto">
      <MangaFile
        v-for="(file, ifile) in sortedFiles"
        :key="ifile"
        :file="file"
      />
    </ol>
  </li>
</template>

<script lang="ts" setup>
import fs from "fs";
import { defineProps } from "@vue/runtime-core";
import path from "path";
import { shell } from "electron";
import MangaFile from "./MangaFile.vue";
import { computed, onUnmounted } from "vue";
import router from "@/router";

const props = defineProps<{
  folder: {
    path: string;
    stat: fs.Stats;
  };
}>();

const mangaName = path.basename(props.folder.path);
const imageLink = `https://japscan.ws/imgs/mangas/${mangaName}.jpg`;
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

const backgroundColor = stringToColour(mangaName);

const sortedFiles = computed(() => {
  var customSort = (a: { path: string }, b: { path: string }) => {
    const noNullMatch = (str: string) => {
      return (str.match(/(\d+)/g) ?? [0])[0];
    };
    return +noNullMatch(a.path) - +noNullMatch(b.path);
  };
  return readdirSyncFullPath().sort(customSort);
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

const interval = setInterval(() => {
  readdirSyncFullPath();
}, 1000);

onUnmounted(() => {
  clearInterval(interval);
});

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
