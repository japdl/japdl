<template>
  <div class="home">
    <h1>Bienvenue sur japdl!</h1>
    <p ref="welcome" v-if="info">{{ info }}</p>
    <p v-else>Chargement...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  data() {
    return {
      info: "" as string,
    };
  },
  name: "Home",
  mounted() {
    axios
      .get("https://raw.githubusercontent.com/Seysa/japdl/main/README.md", {
        responseType: "text",
      })
      .then((data) => {
        const infos: string[] = data.data.split(/#+.*\n/);
        infos.shift();
        this.info = infos[0];
      })
      .catch((e) => {
        this.info =
          "Une erreur s'est produite pendant la récupération du message d'accueil. Veuillez vérifier votre connexion internet. Erreur complète: " +
          e;
      });
  },
});
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
