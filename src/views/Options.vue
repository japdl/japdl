<template>
  <div id="options" class="container w-2/3 mx-auto flex flex-col gap-1">
    <DebugVariables v-if="debug" :state="state.options" title="options" />

    <ChooseBetweenTwo
      header="Format des fichiers d'images"
      first="png"
      second="jpg"
      :selected="imageFormatToChoice"
      @choice="handleImageFormat"
    />
    <Container>
      <h1 class="header">Chemin vers Chrome</h1>
      <input
        type="text"
        v-model="state.options.chromePath"
        placeholder="Veuillez entrer un chemin"
        class="rounded-md bg-gray-100 p-2 text-black block w-full"
      />
      <BaseButton class="mt-2" @click="chooseChromePath">
        Choisir un fichier
      </BaseButton>
      <BaseButton class="mt-2" @click="checkPath(state.options.chromePath)">
        Vérifier le chemin
      </BaseButton>
      <div class="message">{{ state.pathMessage }}</div>
      <div class="error">{{ state.pathError }}</div>
    </Container>
    <Container header="Dossier de téléchargement" id="downloadDirectory">
      <input
        type="text"
        v-model="state.options.outputDirectory"
        class="rounded-md bg-gray-100 p-2 text-black block w-full"
      />
      <BaseButton class="mt-2" @click="chooseOutPath"
        >Choisir un dossier</BaseButton
      >
      <BaseButton class="mt-2" @click="defaultOutPath">Par défaut</BaseButton>
      <BaseButton class="mt-2" @click="openOutPath"
        >Ouvrir le dossier</BaseButton
      >
    </Container>
    <BaseButton class="text-2xl mt-2" @click="setData">
      Sauvegarder les modifications
    </BaseButton>
    <div
      id="message"
      class="text-center text-xl opacity-70"
      v-scroll-to
      v-if="state.message"
    >
      {{ state.message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer, shell } from "electron";
import { computed, reactive } from "vue";
import { configData } from "@/utils/handleConfig";
import { inject } from "@vue/runtime-core";
import fs from "fs";
import DebugVariables from "@/components/DebugVariables.vue";
import BaseButton from "@/components/BaseButton.vue";
import Container from "@/components/Container.vue";
import ChooseBetweenTwo, { Choice } from "@/components/ChooseBetweenTwo.vue";

const debug = inject("debug");

const state = reactive({
  options: {} as configData,
  possibleOptions: {} as { [key: string]: string[] },
  message: "" as string,
  pathMessage: "" as string,
  pathError: "" as string,
  //@ts-expect-error doesn't understand Timeout type
  // eslint-disable-next-line no-undef
  timeout: null as null | Timeout,
  //@ts-expect-error doesn't understand Timeout type
  // eslint-disable-next-line no-undef
  pathTimeout: null as null | Timeout,
});

ipcRenderer.send("getConfigData");
ipcRenderer.once("returnConfigData", (event, data: configData) => {
  state.options = data;
});
ipcRenderer.send("getPossibleOptions");
ipcRenderer.once("returnPossibleOptions", (event, data) => {
  state.possibleOptions = data;
});

function setData() {
  const data = ipcRenderer.sendSync("setDataSync", {
    theme: state.options.theme,
    outputDirectory: state.options.outputDirectory,
    imageFormat: state.options.imageFormat,
    chromePath: state.options.chromePath,
  } as configData);
  if (state.timeout) clearTimeout(state.timeout);
  if (data === "ok") {
    state.message = "Les options ont été enregistrées avec succès";
  } else {
    const objectEntries = Object.entries(data);
    const errorMessage = objectEntries
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    state.message = `Erreur lors de l'enregistrement des options: ${errorMessage}`;
  }
  state.timeout = setTimeout(() => {
    state.message = "";
    state.timeout = null;
  }, 2000);
}

function chooseChromePath() {
  const [newPath] = ipcRenderer.sendSync("file-question");
  if (newPath) {
    state.options.chromePath = newPath;
    // verif path
    checkPath(newPath);
  }
}

function chooseOutPath() {
  const [newPath] = ipcRenderer.sendSync("directory-question");
  if (newPath) state.options.outputDirectory = newPath;
}
function checkPath(path: string) {
  if (fs.existsSync(path)) {
    const data = ipcRenderer.sendSync("checkChromePath", path);
    if (data.good) {
      state.pathMessage = "Le chemin est bon";
    } else {
      state.pathMessage = "Le fichier n'est pas chrome";
      state.pathError = data.msg;
    }
  } else {
    state.pathError = "Le chemin n'existe pas";
    state.pathTimeout = setTimeout(() => {
      state.pathMessage = "";
      state.pathError = "";
      state.pathTimeout = null;
    }, 5000);
  }
}

function defaultOutPath() {
  const data = ipcRenderer.sendSync("getDefaultDataSync");
  state.options.outputDirectory = data.outputDirectory;
}

function openOutPath() {
  shell.showItemInFolder(state.options.outputDirectory);
}

function handleImageFormat(selection: Choice) {
  if (selection === Choice.None) return;
  if (selection === Choice.First) {
    state.options.imageFormat = "png";
  } else {
    state.options.imageFormat = "jpg";
  }
}

const imageFormatToChoice = computed(() => {
  if (state.options.imageFormat === "png") {
    return Choice.First;
  } else if (state.options.imageFormat === "jpg") {
    return Choice.Second;
  } else {
    return Choice.None;
  }
});
</script>

<style scoped>
.header {
  @apply text-2xl font-bold mb-4;
}
</style>
