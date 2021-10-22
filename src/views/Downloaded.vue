<template>
  <h1 class="text-center text-2xl">
    Downloaded in {{ config.outputDirectory }}
  </h1>
  <div>
    <div id="directories">
      <div v-for="(folder, ifolder) in folders" :key="ifolder">
        <div>
          <h2 class="text-4xl font-manga">{{ path.basename(folder.path) }}</h2>
          <button class="basic" @click="shell.openPath(folder.path)">
            Ouvrir le dossier
          </button>
          <div
            v-for="(file, ifile) in readdirSyncFullPath(folder.path)"
            :key="ifile"
          >
            <div class="flex items-center">
                <img
                class="icon mr-2"
                v-if="file.stat.isDirectory()"
                src="../assets/svg/image-folder.svg"
                alt="fileIcon"
              />
              <img
                class="icon mr-2"
                v-if="file.stat.isFile()"
                src="../assets/svg/read.svg"
                alt="fileIcon"
              />
              <span :class="{ error: file.stat.isFile() }">{{
                path.basename(file.path)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { configData } from "@/utils/handleConfig";
import { ipcRenderer, shell } from "electron";
import fs from "fs";
import path from "path";

function readdirSyncFullPath(folder: string) {
  return fs.readdirSync(folder).map((file) => {
    const filePath = path.join(folder, file);
    return { path: filePath, stat: fs.lstatSync(filePath) };
  });
}

const config: configData = ipcRenderer.sendSync("getConfigDataSync");
const folders = readdirSyncFullPath(config.outputDirectory).filter((file) =>
  fs.lstatSync(file.path).isDirectory()
);
</script>
