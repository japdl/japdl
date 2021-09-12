<template>
  <div class="flex justify-center items-center flex-col w-full">
    <form @submit.prevent="search">
      <label>Chercher un manga: </label>
      <input
        type="search"
        class="rounded-md bg-gray-100 p-1"
        placeholder="Nom du manga"
        v-model="mangaName.value"
        required
      />
      <button class="basic uppercase">Rechercher</button>
    </form>
    <div id="suggestion">
      <Manga
        v-for="result in state.results"
        :key="result.name"
        :infos="result"
        @click="submitResult(result)"
        class="cursor-pointer"
      />
    </div>
    <p class="error" v-if="state.errors.length > 0">
      <span v-for="error in state.errors" :key="error">{{ error }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { SearchInfos } from "japscandl/js/src/utils/types";
import { defineEmit, reactive } from "vue";
import Manga from "./Manga.vue";

const state = reactive({
  errors: [] as string[],
  loading: false as boolean,
  results: [] as SearchInfos[],
});

const mangaName = reactive({
  value: "" as string,
  validated: false as boolean,
  errors: [] as string[],
});

const emits = defineEmit(["manga"]);

function submitResult(result: SearchInfos) {
  // reset values
  state.results = [];
  mangaName.value = "";
  emits("manga", result);
}

function search() {
  console.log('"' + mangaName.value + '"');
  if (mangaName.value === "") {
    state.results = [];
    return;
  }
  state.loading = true;

  ipcRenderer.send("search", {
    sync: false,
    value: mangaName.value,
  });

  ipcRenderer.once("searchResult", (event, arg) => {
    if (arg.value === mangaName.value) {
      state.loading = false;
      state.results = arg.results;
      console.log("Recu ", arg);
    } else {
      console.log(arg.value, "!==", mangaName.value);
    }
  });
}
</script>

<style scoped>
.result {
  border: solid 1px white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100px;
  max-width: 30vw;
  cursor: pointer;
}
.result:hover {
  background-color: rgba(211, 211, 211, 0.404);
  transition: 0.2s;
}

input {
  color: black;
}
</style>
