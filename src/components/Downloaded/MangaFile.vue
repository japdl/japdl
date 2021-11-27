<template>
  <li>
    <Container
      class="
        flex
        items-center
        justify-around
        cursor-pointer
        transition-opacity
        duration-75
        hover:opacity-80
        h-0
        w-full
      "
      :title="hoverMessage"
      @click="handleOpenPath()"
    >
      <ImageFolder v-if="file.stat.isDirectory()" class="w-20 mr-2" />
      <Read v-if="file.stat.isFile()" class="w-10 mr-2" />
      <span :class="{ error: file.stat.isFile() }" class="w-full">{{
        baseName
      }}</span>
      <span
        v-if="file.stat.isDirectory()"
        id="nbOfPages"
        class="text-xs w-full text-right"
        >{{ numberOfImages() }} pages</span
      >
    </Container>
  </li>
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
