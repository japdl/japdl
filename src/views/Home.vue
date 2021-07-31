<template>
  <div class="home">
    <h1>Bienvenue sur japdl!</h1>
    <p v-if="state.info">{{ state.info }}</p>
    <p v-else>Chargement...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import axios from "axios";

export default defineComponent({
  setup() {
    const state = reactive({
      info: "" as string,
    });

    onMounted(() => {
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
    });

    return {
      state,
    };
  },
  name: "Home",
});
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
