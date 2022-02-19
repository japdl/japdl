<template>
  <nav
    class="h-14 select-none flex justify-evenly items-center rounded-b-2xl bg-dark-background border-l-2 border-light-background"
  >
    <router-link
      v-for="route in routes"
      :key="route.name"
      :to="route.path"
      draggable="false"
      class="h-full flex justify-center items-center mx-2 p-2 rounded-xl transition-all duration-200 w-full text-center min-w-max hover:text-primary"
    >
      <span>{{ route.name }}</span>
    </router-link>
  </nav>
</template>

<script lang="ts" setup>
const routes = [
  { name: "Accueil", path: "/" },
  { name: "Télécharger un manga", path: "/download" },
  { name: "Mangas téléchargés", path: "/downloaded" },
  /* { name: "Lire", path: "/reader" }, */
  { name: "Options", path: "/options" },
];
</script>

<style scoped>
nav a.router-link-exact-active {
  @apply text-primary;
}
nav a:hover {
  @apply text-dark-primary bg-gradient-to-t from-light-background to-dark-background;
}
</style>
