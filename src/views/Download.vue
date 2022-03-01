<template>
  <div class="telecharger" v-if="state.japscanInitiated">
    <div v-if="debug" class="flex gap-1">
      <DebugVariables header="state" :state="state" />
      <DebugVariables header="manga" :state="manga" />
    </div>
    <ChooseManga @manga="getMangaInfos($event.japscan)" />
    <div id="afterMangaChoosen" class="p-6" v-if="manga.name && !state.loading">
      <div id="topView" class="flex gap-6 flex-wrap">
        <MangaImage :manga="manga.japscanName" class="mx-auto rounded" />
        <div id="summary">
          <WebLink
            :link="'https://japscan.ws/manga/' + manga.japscanName + '/'"
            :text="manga.name"
            class="font-manga text-6xl bg-gray hover:text-blue-400"
            title="Voir sur Japscan"
          />
          <div class="informations p-5">
            <p class="text-xl" v-if="manga.volumes">
              <strong>Volumes:</strong> {{ manga.volumes }}
            </p>
            <p class="text-xl mb-4" v-if="manga.chapters">
              <strong>Chapitres:</strong> {{ manga.chapters }}
            </p>
            <p class="text-current opacity-80" v-if="manga.synopsis">
              {{ manga.synopsis }}
            </p>
          </div>
        </div>
      </div>
      <ChooseDownloadType @type="getType" />
      <form
        v-if="manga.type && !state.loading"
        @submit.prevent="downloadSelected"
      >
        <ChooseRange
          v-model:range="state.range"
          :max="selectMax"
          :type="manga.type"
        />
        <p class="error" v-if="isRangeInvalid">
          Veuillez entrer un numéro de {{ manga.type }}
        </p>
        <ChooseOptions v-model:options="state.options" />
        <p class="error" v-if="areOptionsInvalid">
          Une option de type fichier ou l'option de téléchargement des images
          doit être cochée pour procéder au téléchargement
        </p>
        <div id="buttonWrapper">
          <BaseButton
            id="downloadButton"
            type="submit"
            :disabled="isRangeInvalid || areOptionsInvalid"
          >
            Télécharger
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
  <div v-else class="error">
    Le chemin de chrome n'est pas valide: L'application n'a pas pu se lancer
    correctement
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import ChooseManga from "@/components/ChooseManga.vue";
import ChooseDownloadType from "@/components/Download/ChooseDownloadType.vue";
import { ipcRenderer } from "electron";
import ChooseRange from "@/components/Download/ChooseRange.vue";
import ChooseOptions from "@/components/Download/ChooseOptions.vue";
import DebugVariables from "@/components/DebugVariables.vue";
import MangaImage from "@/components/MangaImage.vue";
import { inject, defineProps } from "@vue/runtime-core";
import { LocationQuery } from "vue-router";
import WebLink from "@/components/WebLink.vue";
import { startLoading, stopLoading } from "@/utils/loadingState";
import BaseButton from "@/components/BaseButton.vue";

const props = defineProps<{
  query?: LocationQuery;
}>();

const debug = inject("debug");

const state = reactive({
  range: {} as { start?: number; end?: number },
  options: {} as { compression: "cbr" | ""; images: boolean },
  error: "" as string,
  loading: false as boolean,
  japscanInitiated: ipcRenderer.sendSync("readyStatus") as boolean,
});

const manga = reactive({
  name: "" as string,
  japscanName: "" as string,
  volumes: null as null | number,
  chapters: null as null | number,
  type: "" as string,
  synopsis: "" as string,
});

const isRangeInvalid = computed(() => {
  return state.range.start === undefined;
});

const selectMax = computed(() => {
  return manga.type === "volume"
    ? (manga.volumes as number)
    : (manga.chapters as number);
});
const areOptionsInvalid = computed(() => {
  return state.options.compression === "" && !state.options.images;
});

function downloadSelected(): void {
  const toSend = {
    type: manga.type,
    manga: manga.japscanName,
    start: state.range.start,
    end: state.range.end,
    compression: !!state.options.compression,
    keepImages: state.options.images,
  };
  console.log("Sending", toSend);
  ipcRenderer.send("download", toSend);
}
function getMangaInfos(mangaName: string) {
  // reset last manga's infos
  manga.type = "";
  manga.volumes = manga.chapters = null;
  console.log("Nom du manga: ", mangaName);
  state.loading = true;
  startLoading();
  ipcRenderer.send("getMangaInfos", mangaName);
  ipcRenderer.once("replyMangaInfos", (event, infos) => {
    if (infos) {
      manga.name = infos.display;
      manga.japscanName = infos.name;
      manga.volumes = infos.volumes;
      manga.chapters = infos.chapters;
      manga.synopsis = infos.synopsis;
    }
    state.loading = false;
    stopLoading();
  });
}
function getType(type: string) {
  manga.type = type;
  console.log("type: ", type);
}

if (props?.query?.manga) {
  getMangaInfos(props.query.manga as string);
}
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
</style>
