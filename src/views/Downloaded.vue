<template>
  <div v-if="valid">
    <div class="flex justify-center items-center flex-col">
      <h1 class="text-center flex flex-col">
        Mangas téléchargés dans le dossier
        <button class="basic" @click="shell.openPath(config.outputDirectory)">
          {{ config.outputDirectory }}
        </button>
      </h1>
    </div>
    <div>
      <ul id="directories" class="flex flex-wrap justify-center">
        <MangaDirectory
          v-for="(folder, ifolder) in folders"
          :key="ifolder"
          class="m-6 min-w-max"
          :folder="folder"
        />
      </ul>
    </div>
  </div>
  <div v-else class="text-center text-2xl">
    <h1>Vous n'avez rien téléchargé pour le moment</h1>
  </div>
</template>

<script lang="ts" setup>
import { configData } from "@/utils/handleConfig";
import { ipcRenderer, shell } from "electron";
import fs from "fs";
import path from "path";
import { ref } from "vue";
import MangaDirectory from "@/components/Downloaded/MangaDirectory.vue";
import chokidar from "chokidar";

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

const config: configData = ipcRenderer.sendSync("getConfigDataSync");

const folders = ref([] as { path: string; stat: fs.Stats }[]);
function getFolders() {
  folders.value = readdirSyncFullPath(config.outputDirectory).filter(
    (file) => file.stat.isDirectory() && fs.readdirSync(file.path).length > 0
  );
}

// valid if has files in it
getFolders();

// watch for file changes to auto update
const watcher = chokidar.watch(config.outputDirectory, {
  awaitWriteFinish: true,
  ignored: /^\./,
});

watcher.on("add", getFolders);
watcher.on("addDir", getFolders);
watcher.on("change", getFolders);

const valid = ref(!!folders.value.length);
</script>
