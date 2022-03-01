<template>
  <Container header="Dossier de téléchargement" id="downloadDirectory">
    <input
      :value="props.path"
      @change="handleChange"
      type="text"
      class="rounded-md bg-gray-100 p-2 text-black block w-full"
    />
    <BaseButton class="mt-2" @click="chooseOutPath"
      >Choisir un dossier</BaseButton
    >
    <BaseButton class="mt-2" @click="defaultOutPath"
      >Dossier par défaut</BaseButton
    >
    <BaseButton class="mt-2" @click="openOutPath">Ouvrir le dossier</BaseButton>
  </Container>
</template>

<script lang="ts" setup>
import BaseButton from "../BaseButton.vue";
import Container from "../Container.vue";

import { defineProps, defineEmits } from "@vue/runtime-core";
import { ipcRenderer, shell } from "electron";
const props = defineProps<{
  path: string;
}>();

const emit = defineEmits<{
  (event: "update:path", path: string): void;
}>();

function chooseOutPath() {
  const [newPath] = ipcRenderer.sendSync("directory-question");
  if (newPath) emit("update:path", newPath);
}

function defaultOutPath() {
  const data = ipcRenderer.sendSync("getDefaultDataSync");
  emit("update:path", data.outputDirectory);
}

function openOutPath() {
  shell.showItemInFolder(props.path);
}

function handleChange(path: Event) {
  console.log("CHANGING PATH");
  emit("update:path", (path.target as HTMLInputElement).value);
}
</script>
