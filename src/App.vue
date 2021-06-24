<template>
  <div id="nav">
    <router-link to="/">Accueil</router-link>
    <router-link to="/download">Télécharger un manga</router-link>
    <router-link to="/infos">Informations sur un manga</router-link>
    <router-link to="/about">À propos</router-link>
  </div>
  <div id="main">
    <router-view />
  </div>
  <div id="footer">
    <DownloadBar />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DownloadBar from "@/components/footer/DownloadFooter.vue";

export default defineComponent({
  name: "App",
  components: { DownloadBar },
});
</script>

<style src="../public/global.css"></style>

<style scoped>
#nav {
  grid-area: header;
  display: flex;
  height: 80px;
  background-color: var(--dark-background);
  width: 100vw;
  justify-content: space-evenly;
  align-items: unset;
}

#nav a {
  text-decoration: none;
  display: flex;
  font-weight: bold;
  color: white;
  border: 1px solid black;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
#nav a.router-link-exact-active {
  color: var(--dark-primary);
}
#nav a:hover {
  color: var(--primary);
  background-image: linear-gradient(
    to bottom left,
    var(--light-background),
    var(--dark-background)
  );
}

#main {
  grid-area: main;
  padding: 15px 5px 10px 5px;
  overflow: auto;
}

#footer {
  grid-area: footer;
}
</style>
