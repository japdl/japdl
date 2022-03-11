<template>
  <Container>
    <h1 class="header">Chemin vers Chrome</h1>
    <p class="opacity-80 mb-2 font-bold underline">
      Si le programme fonctionne, n'y touchez pas!
    </p>
    <input
      type="text"
      @change="emit('update:path', ($event?.target as HTMLTextAreaElement).value)"
      placeholder="Veuillez entrer un chemin"
      :value="path"
      class="rounded-md bg-gray-100 p-2 text-black block w-full"
    />
    <BaseButton class="mt-2" @click="chooseChromePath">
      Choisir un fichier
    </BaseButton>
    <BaseButton class="mt-2" @click="checkPath(props.path)">
      Vérifier le chemin
    </BaseButton>
    <BaseButton class="mt-2" @click="downloadChrome"
      >Télécharger chrome*</BaseButton
    >
    <p class="opacity-80 mt-2">
      *Une version de
      <WebLink
        link="https://en.wikipedia.org/wiki/Chromium_(web_browser)"
        text="google chromium"
        class="font-bold"
      />
      sera téléchargé sur votre pc permettant le bon fonctionnement du
      programme. Le téléchargement n'est pas obligatoire. Ce téléchargement
      n'est recommandé que si vous ne possédez pas chrome sur votre ordinateur
      ou que vous ne savez pas comment trouver chrome sur votre ordinateur.
    </p>
    <div id="message" class="message">{{ state.message }}</div>
    <div class="text-red-500">{{ state.error }}</div>
  </Container>
</template>

<script lang="ts" setup>
import fs from "fs";
import Container from "../Container.vue";
import BaseButton from "../BaseButton.vue";
import { defineProps, defineEmits } from "@vue/runtime-core";
import { ipcRenderer } from "electron";
import { reactive } from "vue";
import WebLink from "../WebLink.vue";

const props = defineProps<{
  path: string;
}>();

const state = reactive({
  message: "" as string,
  error: "" as string,
  //@ts-expect-error doesn't understand Timeout type
  // eslint-disable-next-line no-undef
  timeout: null as null | Timeout,
});

const emit = defineEmits<{
  (event: "update:path", path: string): void;
}>();

function chooseChromePath() {
  const [newPath] = ipcRenderer.sendSync("file-question");
  if (newPath) {
    emit("update:path", newPath);
    // verif path
    checkPath(newPath);
  }
}

function checkPath(path: string) {
  if (fs.existsSync(path)) {
    const data = ipcRenderer.sendSync("checkChromePath", path);
    if (data.good) {
      state.message = "Le chemin est bon, vous pouvez vous en servir";
    } else {
      state.message = "Invalide, Le fichier n'est pas un navigateur chrome";
      state.error = data.msg;
    }
  } else {
    state.error = "Le chemin n'existe pas";
    state.timeout = setTimeout(() => {
      state.message = "";
      state.error = "";
      state.timeout = null;
    }, 5000);
  }
}

function downloadChrome() {
  ipcRenderer.send("downloadChrome");
}
</script>
