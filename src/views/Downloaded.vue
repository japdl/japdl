<template>
  <div v-if="valid">
    <div class="flex justify-center items-center flex-col">
      <h1 class="text-center text-2xl">
        Mangas téléchargés dans le dossier {{ config.outputDirectory }}
      </h1>
      <button class="basic text-2xl my-3" @click="getFolders">
        Rafraîchir la liste des fichiers
      </button>
    </div>
    <div>
      <div id="directories" class="flex flex-wrap">
        <MangaDirectory
          v-for="(folder, ifolder) in folders"
          :key="ifolder"
          class="m-6 min-w-max"
          :folder="folder"
        />
      </div>
    </div>
  </div>
  <div v-else class="text-center text-2xl">
    <h1>Vous n'avez rien téléchargé pour le moment</h1>
  </div>
</template>

<script lang="ts" setup>
import { configData } from "@/utils/handleConfig";
import { ipcRenderer } from "electron";
import fs from "fs";
import path from "path";
import { ref } from "vue";
import MangaDirectory from "@/components/Downloaded/MangaDirectory.vue";

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
const valid = ref(!!folders.value.length);
</script>
