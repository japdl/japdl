<template>
  <div id="nav">
    <router-link to="/">Accueil</router-link> |
    <router-link to="/telecharger">Télécharger un manga</router-link> |
    <router-link to="/infos">Informations sur un manga</router-link> |
    <router-link to="/about">À propos</router-link>
  </div>
  <router-view class="view" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>

<style>
body {
  margin: 0;
  background-color: #181818;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  height: 100vh;
}

#nav {
  padding: 30px;
  background-color: #20201e;
  margin: 0 auto;
}

#nav a {
  font-weight: bold;
  color: white;
  background-color: black;
  padding: 15px;
  border-radius: 10px;
}

#view {
}

#nav a:hover {
  color: #3ea37a;
  background-color: #628290;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
