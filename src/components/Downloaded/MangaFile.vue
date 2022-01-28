<template>
  <li>
    <Container
      class="flex items-center justify-around cursor-pointer transition-opacity duration-100 hover:opacity-80 h-0 w-full"
      :title="hoverMessage"
      @click="handleOpenPath()"
    >
      <DirectoryFile v-if="file.stat.isDirectory()" :file="file" />
      <ZipFile v-else :file="file" />
    </Container>
  </li>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import { shell } from "electron";
import fs from "fs";
import Container from "../Container.vue";
import DirectoryFile from "./DirectoryFile.vue";
import ZipFile from "./ZipFile.vue";

const props = defineProps<{
  file: {
    path: string;
    stat: fs.Stats;
  };
}>();

const hoverMessage = props.file.stat.isFile() ? "Lire" : "Ouvrir le dossier";

function handleOpenPath() {
  shell
    .openPath(props.file.path)
    .catch((error) => console.error("Error during open path:", error));
}
</script>
