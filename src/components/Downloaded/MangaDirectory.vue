<template>
  <div class="m-6 min-w-max flex flex-col gap-1 p-2">
    <h2 class="text-4xl font-manga text-center">
      {{ path.basename(folder.path) }}
    </h2>
    <button class="basic mb-5" @click="shell.openPath(folder.path)">
      Ouvrir le dossier
    </button>
    <MangaFile v-for="(file, ifile) in sortedFiles" :key="ifile" :file="file" />
  </div>
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
</script>
