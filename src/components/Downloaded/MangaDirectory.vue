<template>
  <li
    id="wrapper"
    class="m-6 min-w-max flex flex-col gap-1 p-2 items-center mt-20"
  >
    <img :src="imageLink" id="mangaImage" class="w-40 self-center" />
    <h2 class="text-4xl font-manga text-center mt-2">
      {{ mangaName }}
    </h2>
    <button class="basic mt-3" @click="shell.openPath(folder.path)">
      Ouvrir le dossier
    </button>
    <button class="basic mb-5" @click="shell.openExternal(mangaLink)">
      Voir sur japscan
    </button>
    <ol
      class="
        flex flex-col
        gap-0.5
        max-h-96
        overflow-y-scroll
        border-2
        rounded-l-xl
      "
    >
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
import { computed } from "vue";

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

const props =
  defineProps<{
    folder: {
      path: string;
      stat: fs.Stats;
    };
  }>();

const mangaName = path.basename(props.folder.path);
const imageLink = `https://japscan.ws/imgs/mangas/${mangaName}.jpg`;
const mangaLink = `https://www.japscan.ws/manga/${mangaName}/`;
</script>
