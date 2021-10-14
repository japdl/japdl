<template>
  <nav>
    <router-link
      v-for="route in clickableRoutes"
      :key="route.name"
      :to="route.path"
      >{{ route.name }}
    </router-link>
  </nav>
</template>

<script lang="ts" setup>
import route from "@/router";
import { ref, computed } from "vue";

const routes = ref(
  route.getRoutes().map(({ name, path }) => ({ name: name as string, path }))
);

const clickableRoutes = computed(() =>
  routes.value.filter((route) => route.name)
);
</script>

<style scoped>
nav {
  grid-area: header;
  display: flex;
  height: 5rem;
  background-color: var(--dark-background);
  width: 100%;
  justify-content: space-evenly;
  align-items: unset;
  text-align: center;
  grid-area: "header";
}

nav a {
  text-decoration: none;
  display: flex;
  font-weight: bold;
  color: var(--text-color);
  border: 1px solid black;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
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
