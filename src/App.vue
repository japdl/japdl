<template>
  <div id="nav">
    <router-link to="/">Accueil</router-link>
    <router-link to="/download">Télécharger un manga</router-link>
    <router-link to="/infos">Informations sur un manga</router-link>
    <router-link to="/about">À propos</router-link>
  </div>
  <router-view />
  <DownloadBar />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DownloadBar from "@/components/footer/DownloadFooter.vue";

export default defineComponent({
  name: "App",
  components: { DownloadBar },
});
</script>

<style>
body {
  margin: 0;
  background-color: #24292e;
}
#app {
  display: flex;
  flex-direction: column;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  align-items: center;
  color: white;
}

#nav {
  display: flex;
  height: 80px;
  background-color: #1d2125;
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

#nav a:hover {
  color: red;
  background-color: #628290;
}

#nav a.router-link-exact-active {
  color: #880921;
}

.icon {
  width: 40px;
}

.error {
  color: red;
}
</style>
