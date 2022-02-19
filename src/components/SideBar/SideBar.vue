<template>
  <aside
    class="flex flex-col bg-dark-background items-center w-72 h-full overflow-y-auto rounded"
  >
    <h1 class="font-manga tracking-wide text-2xl my-2">Téléchargements</h1>
    <div id="downloads" class="w-full flex flex-col h-full">
      <div v-if="debug" class="flex flex-col gap-1 my-2">
        <button class="basic" @click="currentDownload = null">Vider</button>
        <button class="basic" @click="currentDownload = chapterDownload">
          Chapitre
        </button>
        <button class="basic" @click="currentDownload = chaptersDownload">
          Chapitres
        </button>
        <button class="basic" @click="currentDownload = volumeDownload">
          Volume
        </button>
        <button class="basic" @click="currentDownload = volumesDownload">
          Volumes
        </button>
      </div>
      <h1 class="text-center opacity-70 pt-5" v-if="!displaysAnything">
        Aucun téléchargement en cours
      </h1>
      <div class="flex flex-col gap-4">
        <SideDownload v-if="currentDownload" :download="currentDownload" />

        <div v-if="queue.length > 0" class="text-center">
          <h2>En attente</h2>
          <div v-for="queueElement in queue" :key="queueElement">
            {{ queueElement }}
          </div>
        </div>

        <div v-if="done.length > 0" class="text-center">
          <h2>Terminé</h2>

          <div
            class="opacity-80"
            v-for="doneElement in done"
            :key="doneElement"
          >
            {{ doneElement }}
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { ChapterDownload } from "@/utils/downloadHandler/chapter";
import { ChaptersDownload } from "@/utils/downloadHandler/chapters";
import { VolumeDownload } from "@/utils/downloadHandler/volume";
import SideDownload from "./SideDownload.vue";
import { ipcRenderer } from "electron";
import { computed, inject, ref } from "vue";
import { VolumesDownload } from "@/utils/downloadHandler/volumes";
import { SideBarDownload } from "@/utils/downloadHandler";

const percent = (current: number, total: number) => (current / total) * 100;

const debug = inject("debug");

const chapterDownload: ChapterDownload = {
  manga: "fire-punch",
  current: 15,
  num: "120",
  percent: percent(15, 20),
  total: 20,
  type: "chapter",
};

const chaptersDownload: ChaptersDownload = {
  manga: "shingeki-no-kyojin",
  currentChapter: "123",
  start: "120",
  end: "130",
  percent: percent(4, 11),
  current: 4,
  total: 11,
  type: "chapters",
};

const volumeDownload: VolumeDownload = {
  currentName: "128",
  manga: "shingeki-no-kyojin",
  num: "12",
  percent: percent(3, 9),
  current: 3,
  total: 9,
  type: "volume",
};

const volumesDownload: VolumesDownload = {
  currentChapter: "128",
  currentVolume: 12,
  manga: "shingeki-no-kyojin",
  start: 12,
  end: 13,
  percent: percent(3, 9),
  current: 3,
  total: 9,
  type: "volumes",
};

const queue = ref<string[]>(debug ? ["one-piece 999", "one-piece 1000"] : []);
const done = ref<string[]>(debug ? ["one-piece 996", "one-piece 997"] : []);
let currentDownload = ref<SideBarDownload | null>(null);
const displaysAnything = computed(
  () =>
    queue.value.length + done.value.length > 0 || currentDownload.value !== null
);

ipcRenderer.on("update-queue", (event, data: string[]) => {
  data.shift();
  queue.value = data;
});

ipcRenderer.on("update-current", (event, data: ChapterDownload) => {
  currentDownload.value = data;
});

ipcRenderer.on("update-done", (event, data) => {
  done.value = data;
});
</script>

<style scoped>
h2 {
  @apply text-center text-xl font-manga tracking-wide bg-dark-primary mb-2 text-white;
}

span,
h3 {
  @apply block text-center;
}

.download {
  @apply h-40 border-2 border-dark-primary rounded;
}
</style>
