<template>
  <div id="nav">
    <router-link
      v-for="route in clickableRoutes"
      :key="route.name"
      :to="route.path"
      >{{ route.name }}
    </router-link>
  </div>
  <div id="main">
    <router-view />
  </div>
  <div id="footer">footer</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import route from "@/router";
import { ipcRenderer } from "electron";

export default defineComponent({
  name: "App",
  components: {},
  data() {
    return {
      routes: [] as { name: string; path: string }[],
    };
  },
  mounted() {
    this.routes = route
      .getRoutes()
      .map(({ name, path }) => ({ name: name as string, path }));
    const appElement = document.getElementById("app") as HTMLDivElement;
    console.log("Sending set theme");
    ipcRenderer.send("getTheme");
    ipcRenderer.on("changeTheme", (event, data) => {
      console.log("Changing theme to " + data);
      appElement.classList.remove("light", "dark");
      appElement.classList.add(data);
    });
  },
  computed: {
    clickableRoutes() {
      //@ts-expect-error route is ok
      return this.routes.filter((route) => route.name);
    },
  },
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
  color: var(--text-color);
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
  background-color: var(--light-background);
}

#footer {
  grid-area: footer;
  overflow-y: scroll;
  max-height: 200px;
}
</style>
