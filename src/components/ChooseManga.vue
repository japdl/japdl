<template>
  <Container>
    <!-- Make a form containing an input, a submit button and a close button to clear results-->
    <form @submit.prevent="search" class="p-4 flex">
      <input
        type="search"
        class="rounded-md bg-gray-100 p-2 text-black"
        placeholder="Nom du manga"
        v-model="mangaName.value"
        required
      />
      <button class="basic" type="submit">Rechercher</button>
    </form>
    <Loading v-if="state.loading" />
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
  </Container>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { SearchInfos } from "japscandl/js/src/utils/types";
import { defineEmits, reactive } from "vue";
import Manga from "./Manga.vue";
import Loading from "./Loading.vue";
import Container from "./Container.vue";

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

const emits = defineEmits(["manga"]);

function submitResult(result: SearchInfos) {
  // reset values
  state.results = [];
  mangaName.value = "";
  emits("manga", result);
}

function search() {
  state.errors.length = 0;
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
    state.loading = false;
    state.results = arg.results;
    if (state.results.length === 0) {
      state.errors.push("La recherche n'a donné aucun résultat");
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
</style>
