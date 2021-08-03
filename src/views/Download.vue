<template>
  <div class="telecharger" v-if="state.japscanInitiated">
    <img class="icon" src="../assets/noun-torii.svg" />
    <Container title="variables" v-if="debug">
      <div v-for="(variable, name) in state" :key="name">
        <strong>{{ name }}</strong>
        {{ typeof variable === "string" ? '"' + variable + '"' : variable }}
      </div>
    </Container>
    <ChooseManga @manga="getMangaInfos" />
    <Loading v-if="state.loading" />
    <div id="afterMangaChoosen" v-if="state.mangaName && !state.loading">
      <h1>{{ state.mangaName }}</h1>
      <div class="informations">
        <p>
          <strong>Dernier volume:</strong> {{ state.mangaVolumes }} <br />
          <strong>Dernier chapitre:</strong> {{ state.mangaChapters }} <br />
          <strong>Synopsis:</strong> {{ state.mangaSynopsis }}
        </p>
      </div>
      <ChooseDownloadType @type="getType" />
      <form
        v-if="state.mangaType && !state.loading"
        @submit.prevent="downloadSelected"
      >
        <ChooseRange
          v-model:range="state.range"
          :max="selectMax"
          :type="state.mangaType"
        />
        <p class="error" v-if="!isRangeValid">
          Veuillez entrer un numéro de {{ state.mangaType }}
        </p>
        <ChooseOptions v-model:options="state.options" />
        <p class="error" v-if="areOptionsInvalid">
          Une option de type fichier ou l'option de téléchargement des images
          doit être cochée pour procéder au téléchargement.
        </p>
        <!-- Grisés temps que start n'a pas de valeur -->
        <div id="buttonWrapper">
          <button
            id="downloadButton"
            type="submit"
            class="basic"
            :disabled="!isRangeValid || areOptionsInvalid"
          >
            Télécharger
          </button>
        </div>
      </form>
    </div>
  </div>
  <div v-else class="error">
    Le chemin de chrome n'est pas valide: L'application n'a pas pu se lancer
    correctement
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import ChooseManga from "@/components/Download/ChooseManga.vue";
import ChooseDownloadType from "@/components/Download/ChooseDownloadType.vue";
import { ipcRenderer } from "electron";
import Loading from "@/components/Loading.vue";
import Container from "@/components/Container.vue";
import ChooseRange from "@/components/Download/ChooseRange.vue";
import ChooseOptions from "@/components/Download/ChooseOptions.vue";
export default defineComponent({
  name: "Download",
  components: {
    ChooseManga,
    ChooseDownloadType,
    ChooseRange,
    ChooseOptions,
    Loading,
    Container,
  },
  emits: ["download"],
  setup() {
    const debug = false;
    const state = reactive({
      range: {} as { start?: number; end?: number },
      options: {} as { compression: "pdf" | "cbr" | ""; images: boolean },
      error: "" as string,
      mangaName: "" as string,
      mangaVolumes: null as null | number,
      mangaChapters: null as null | number,
      mangaType: "" as string,
      mangaSynopsis: "" as string,
      loading: false as boolean,
      japscanInitiated: ipcRenderer.sendSync("japscandlStatus") as boolean,
    });

    const comput = {
      isRangeValid: computed(() => {
        return state.range.start !== undefined;
      }),
      selectMax: computed(() => {
        return state.mangaType === "volume"
          ? (state.mangaVolumes as number)
          : (state.mangaChapters as number);
      }),
      areOptionsInvalid: computed(() => {
        return state.options.compression === "" && !state.options.images;
      }),
    };

    const methods = {
      downloadSelected(): void {
        const toSend = {
          type: state.mangaType,
          manga: state.mangaName,
          start: state.range.start,
          end: state.range.end,
          compression: state.options.compression
            ? state.options.compression
            : undefined,
          keepImages: state.options.images,
        };
        console.log("Sending", toSend);
        ipcRenderer.send("download", toSend);
      },
      getMangaInfos(name: string) {
        // reset last manga's infos
        state.mangaType = "";
        state.mangaVolumes = state.mangaChapters = null;
        console.log("Nom du manga: ", name);
        state.loading = true;
        ipcRenderer.send("getMangaInfos", name);
        ipcRenderer.once("replyMangaInfos", (event, infos) => {
          state.loading = false;
          if (infos) {
            state.mangaVolumes = infos.volumes;
            state.mangaChapters = infos.chapters;
            state.mangaName = infos.name;
            state.mangaSynopsis = infos.synopsis;
          }
        });
      },
      getType(type: string) {
        state.mangaType = type;
        console.log("type: ", type);
      },
      sendDownloadToBackground(options: {
        options: ("pdf" | "cbr" | "images")[];
        start: number;
        end: number;
      }) {
        const compression = Array.from(options.options)
          .filter((element) => element !== "images")
          .pop();
        console.log(compression);
        const emitOptions = {
          start: options.start,
          end: options.end,
          type: state.mangaType,
          manga: state.mangaName,
          compression,
          deleteAfter: !options.options.includes("images"),
        };
        console.log(emitOptions);
        ipcRenderer.send("download", emitOptions);
      },
    };

    return {
      state,
      debug,
      ...methods,
      ...comput,
    };
  },
});
</script>

<style scoped>
.telecharger {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#buttonWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}

#afterMangaChoosen {
  width: 50vw;
}

.error {
  text-align: center;
}

h1 {
  font-family: "Staatliches", cursive;
}
</style>
