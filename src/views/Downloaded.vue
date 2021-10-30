<template>
  <div v-if="valid">
    <div class="flex justify-center items-center flex-col">
      <h1 class="text-center text-2xl">
        Mangas téléchargés dans le dossier {{ config.outputDirectory }}
      </h1>
      <button class="basic text-2xl my-3" @click="getFolders">Rafraîchir les fichiers</button>
    </div>
    <div>
      <div id="directories" class="flex">
        <div v-for="(folder, ifolder) in folders" :key="ifolder" class="m-6">
          <h2 class="text-4xl font-manga text-center">
            {{ path.basename(folder.path) }}
          </h2>
          <button class="basic mb-5" @click="shell.openPath(folder.path)">
            Ouvrir le dossier
          </button>
          <div
            v-for="(file, ifile) in readdirSyncFullPath(folder.path)"
            :key="ifile"
          >
            <div class="flex items-center">
              <ImageFolder v-if="file.stat.isDirectory()" class="icon mr-2" />
              <Read class="icon mr-2" v-if="file.stat.isFile()" />
              <span :class="{ error: file.stat.isFile() }">{{
                path.basename(file.path)
              }}</span>
            </div>
          </div>
        </div>
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
import Read from "@/components/Images/Read.vue";
import ImageFolder from "@/components/Images/ImageFolder.vue";
import { ref } from "vue";

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
  folders.value = readdirSyncFullPath(config.outputDirectory).filter((file) =>
    file.stat.isDirectory()
  );
}

// valid if has files in it
getFolders();
const valid = ref(!!folders.value.length);
</script>
