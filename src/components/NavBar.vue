<template>
  <nav class="select-none h-16 flex justify-evenly items-center rounded-b-2xl">
    <router-link
      v-for="route in routes"
      :key="route.name"
      :to="route.path"
      draggable="false"
      >{{ route.name }}
    </router-link>
  </nav>
</template>

<script lang="ts" setup>
const routes = [
  { name: "Accueil", path: "/" },
  { name: "Télécharger un manga", path: "/download" },
  { name: "Mangas téléchargés", path: "/downloaded" },
  { name: "Options", path: "/options" },
];
</script>

<style scoped>
nav {
  display: flex;
  background-color: var(--dark-background);
}

nav a {
  @apply mx-2 p-4 rounded-xl transition-all duration-200 w-full text-center min-w-max;
}
nav a.router-link-exact-active {
  color: var(--dark-primary);
}
nav a:hover {
  color: var(--primary);
  background-image: linear-gradient(
    to bottom left,
    var(--light-background),
    var(--dark-background)
  );
}
</style>
