<template>
  <Container
    class="
      flex
      items-center
      justify-around
      cursor-pointer
      transition-opacity
      duration-75
      hover:opacity-80
    "
    :title="hoverMessage"
    @click="handleOpenPath()"
  >
    <ImageFolder v-if="file.stat.isDirectory()" class="icon mr-2" />
    <Read class="icon mr-2" v-if="file.stat.isFile()" />
    <span :class="{ error: file.stat.isFile() }" class="w-full">{{
      baseName
    }}</span>
    <span v-if="file.stat.isDirectory()" id="nbOfPages" class="text-xs"
      >{{ numberOfImages() }} pages</span
    >
  </Container>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import { computed } from "@vue/reactivity";
import { shell } from "electron";
import fs from "fs";
import path from "path";
import ImageFolder from "../Images/ImageFolder.vue";
import Read from "../Images/Read.vue";
import Container from "../Container.vue";

const props =
  defineProps<{
    file: {
      path: string;
      stat: fs.Stats;
    };
  }>();

const hoverMessage = props.file.stat.isFile() ? "Lire" : "Ouvrir le dossier";
function numberOfImages() {
  return fs
    .readdirSync(props.file.path)
    .filter((file) => file.endsWith(".jpg") || file.endsWith(".png")).length;
}

const baseName = computed(() => path.basename(props.file.path));

function handleOpenPath() {
  shell
    .openPath(props.file.path)
    .catch((error) => console.error("Error during open path:", error));
}
</script>
