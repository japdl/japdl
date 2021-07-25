<template>
  <div id="chooseManga">
    <form @submit.prevent="search">
      <label>Nom du manga: </label>
      <input type="search" v-model="state.mangaName" required />
      <button class="basic">Rechercher</button>
    </form>
    <div id="suggestion">
      <div
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
        <p v-if="result.mangaka">mangaka(s): {{ result.mangaka }}</p>
      </div>
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

<script lang="ts">
import { ipcRenderer } from "electron";
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "ChooseManga",
  emits: ["manga"],
  setup(props, context) {
    const state = reactive({
      mangaName: "" as string,
      mangaNameValidated: false,
      mangaNameErrors: [] as string[],
      errors: [] as string[],
      loading: false as boolean,
      results: [],
    });

    const methods = {
      submitManga() {
        state.errors.length = 0;
        if (state.mangaName !== "") {
          const matched = state.mangaName.match(/[^a-zA-Z-]/);
          if (matched) {
            if (matched[0] === " ")
              state.errors.push(
                "Le nom du manga ne peut pas contenir d'espaces"
              );
            else
              state.errors.push(
                "Le nom du manga ne peut pas contenir de caractères spéciaux"
              );
          } else {
            context.emit("manga", state.mangaName);
          }
        }
      },
      submitResult(mangaLink: string) {
        const japscanMangaName = mangaLink.split("/manga/")[1].replace("/", "");
        state.results = [];
        state.mangaName = "";
        context.emit("manga", japscanMangaName);
      },
      search() {
        console.log('"' + state.mangaName + '"');
        if (state.mangaName === "") {
          state.results = [];
          return;
        }
        state.loading = true;

        ipcRenderer.send("search", {
          sync: false,
          value: state.mangaName,
        });

        ipcRenderer.once("searchResult", (event, arg) => {
          if (arg.value === state.mangaName) {
            state.loading = false;
            state.results = arg.results;
            console.log("Recu ", arg);
          } else {
            console.log(arg.value, "!==", state.mangaName);
          }
        });
      },
    };

    return {
      state,
      ...methods,
    };
  },
});
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
  background-color: lightgrey;
  transition: 0.2s;
}
</style>
