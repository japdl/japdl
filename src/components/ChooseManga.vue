<template>
  <Container class="flex justify-center items-center flex-col">
    <form @submit.prevent="search" class="p-4 flex">
      <input
        type="search"
        class="rounded-md bg-gray-100 p-2 text-black"
        placeholder="Nom du manga"
        v-model="mangaName.value"
        required
      />
      <BaseButton type="submit">Rechercher</BaseButton>
    </form>
    <BaseButton @click="directSearch">Aller directement</BaseButton>
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
import Container from "./Container.vue";
import { startLoading, stopLoading } from "@/utils/loadingState";
import BaseButton from "./BaseButton.vue";

const emit = defineEmits<{
  (event: "manga", manga: string): void;
}>();

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

function submitResult(result: SearchInfos) {
  // reset values
  state.results = [];
  mangaName.value = "";
  emit("manga", result.japscan);
}

function search() {
  state.errors.length = 0;
  console.log('"' + mangaName.value + '"');
  if (mangaName.value === "") {
    state.results = [];
    return;
  }
  state.loading = true;
  startLoading();

  ipcRenderer.send("search", {
    sync: false,
    value: mangaName.value,
  });

  ipcRenderer.once("searchResult", (event, arg) => {
    state.loading = false;
    stopLoading();
    state.results = arg.results;
    if (state.results.length === 0) {
      state.errors.push("La recherche n'a donné aucun résultat");
    }
  });
}

function directSearch() {
  emit("manga", mangaName.value.trim().toLowerCase());
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
