<template>
  <div id="chooseManga">
    <form @submit.prevent="search">
      <label>Nom du manga: </label>
      <input type="search" v-model="mangaName.value" required />
      <button class="basic">Rechercher</button>
    </form>
    <div id="suggestion" v-if="state.results.length > 0">
      <Manga
        v-for="result in state.results"
        :key="result.name"
        :infos="result"
        @click="submitResult(result.url)"
        class="cursor-pointer"
      />

      <!--div
        v-for="result in state.results"
        :key="result"
        class="result"
        @click="submitResult(result.url)"
      >
        <h3 v-if="result.name">Nom: {{ result.name }}</h3>
        <p v-if="result.original_name">
          Nom original: {{ result.original_name }}
        </p>
        <p v-if="result.alternate_names">
          Nom(s) alternatifs: {{ result.alternate_names }}
        </p>
        <p v-if="result.mangakas">mangaka(s): {{ result.mangakas }}</p>
      </div-->
    </div>
    <p
      class="error"
      v-show="state.errors.length > 0"
      v-for="error in state.errors"
      :key="error"
    >
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { defineEmit, reactive } from "vue";
import Manga from "./Manga.vue";

const state = reactive({
  errors: [] as string[],
  loading: false as boolean,
  results: [] as {
    mangakas: string;
    original_name: string | null;
    name: string;
    url: string;
    alternate_names: string;
  }[],
});

const mangaName = reactive({
  value: "" as string,
  validated: false as boolean,
  errors: [] as string[],
});

const emits = defineEmit(["manga"]);

function submitManga() {
  state.errors.length = 0;
  if (mangaName.value !== "") {
    const matched = mangaName.value.match(/[^a-zA-Z-]/);
    if (matched) {
      if (matched[0] === " ")
        state.errors.push("Le nom du manga ne peut pas contenir d'espaces");
      else
        state.errors.push(
          "Le nom du manga ne peut pas contenir de caractères spéciaux"
        );
    } else {
      emits("manga", mangaName.value);
    }
  }
}
function submitResult(mangaLink: string) {
  const japscanMangaName = mangaLink.split("/manga/")[1].replace("/", "");
  state.results = [];
  mangaName.value = "";
  emits("manga", japscanMangaName);
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
#chooseManga {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

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
