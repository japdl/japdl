<template>
  <div class="flex justify-center items-center h-1/2">
    <div class="text-xl text-center">
      <h1 class="mb-4">Bienvenue sur japdl!</h1>
      <p v-if="state.info">{{ state.info }}</p>
      <p v-else>Chargement...</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { reactive } from "vue";

const state = reactive({
  info: "" as string,
});

axios
  .get("https://raw.githubusercontent.com/Seysa/japdl/main/README.md", {
    responseType: "text",
  })
  .then((data) => {
    const infos: string[] = data.data.split(/#+.*\n/);
    infos.shift();
    state.info = infos[0];
  })
  .catch((e) => {
    state.info =
      "Une erreur s'est produite pendant la récupération du message d'accueil." +
      " Veuillez vérifier votre connexion internet. Erreur complète:" +
      e;
  });
</script>
