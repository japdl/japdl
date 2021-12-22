<template>
  <div v-if="valid">
    <div class="flex justify-center items-center flex-col gap-4">
      <h1 class="text-center flex flex-col">
        Mangas téléchargés dans le dossier
        <button class="basic" @click="shell.openPath(config.outputDirectory)">
          {{ config.outputDirectory }}
        </button>
      </h1>
      <div>
        <input
          type="search"
          v-model="search"
          class="text-black rounded-md bg-gray-100 p-2"
          placeholder="Chercher un manga"
        />
      </div>
    </div>
    <div>
      <ul
        v-if="iterableFolders.length > 0"
        id="directories"
        class="flex flex-wrap justify-center"
      >
        <MangaDirectory
          v-for="folder in iterableFolders"
          :key="folder.path"
          class="m-6 min-w-max"
          :folder="folder"
        />
      </ul>
      <div v-else class="text-center mt-5 text-2xl text-red-700">
        Aucun manga ne correspond à votre recherche
      </div>
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
import { computed, ref } from "vue";
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

const search = ref("");

let lastTimeUpdated: Date | null = null;

const config: configData = ipcRenderer.sendSync("getConfigDataSync");

const folders = ref([] as { path: string; stat: fs.Stats }[]);

const iterableFolders = computed(() => {
  if (search.value === "") {
    return folders.value;
  } else {
    return folders.value.filter((folder) => {
      return path
        .basename(folder.path.toLowerCase())
        .includes(search.value.toLowerCase());
    });
  }
});

function getFolders() {
  if (
    lastTimeUpdated === null ||
    new Date().getMilliseconds() - lastTimeUpdated.getMilliseconds() > 200
  ) {
    lastTimeUpdated = new Date();
    folders.value = readdirSyncFullPath(config.outputDirectory).filter(
      (file) => file.stat.isDirectory() && fs.readdirSync(file.path).length > 0
    );
  } else {
    console.log("Not updating folders because got updated last");
  }
}

getFolders();

// watch for file changes to auto update
const watcher = chokidar.watch(config.outputDirectory, {
  awaitWriteFinish: true,
  ignored: /^\./,
});

watcher.on("add", getFolders);
watcher.on("unlink", getFolders);
watcher.on("addDir", getFolders);
watcher.on("unlinkDir", getFolders);
watcher.on("change", getFolders);

// valid if has files in it
const valid = ref(!!folders.value.length);
</script>
