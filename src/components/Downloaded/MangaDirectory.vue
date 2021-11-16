<template>
  <div class="m-6 min-w-max flex flex-col gap-1 p-2">
    <h2 class="text-4xl font-manga text-center">
      {{ path.basename(folder.path) }}
    </h2>
    <button class="basic mb-5" @click="shell.openPath(folder.path)">
      Ouvrir le dossier
    </button>
    <MangaFile
      v-for="(file, ifile) in readdirSyncFullPath(folder.path)"
      :key="ifile"
      :file="file"
    />
  </div>
</template>

<script lang="ts" setup>
import fs from "fs";
import { defineProps } from "@vue/runtime-core";
import path from "path";
import { shell } from "electron";
import MangaFile from "./MangaFile.vue";

function readdirSyncFullPath(folder: string) {
  try {
    return fs.readdirSync(folder).map((file) => {
      const filePath = path.join(folder, file);
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
