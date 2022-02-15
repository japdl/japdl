<template>
  <aside
    class="flex flex-col bg-dark-background items-center w-72 h-full overflow-y-auto rounded capitalize"
  >
    <h1 class="font-manga tracking-wide text-2xl my-2">Téléchargements</h1>
    <div id="downloads" class="w-full flex flex-col h-full">
      <h1 class="text-center opacity-70 pt-5" v-if="!displaysAnything">
        Aucun téléchargement en cours
      </h1>
      <div class="flex flex-col gap-4">
        <div v-if="currentDownload">
          <h2 class="">En cours</h2>
          <SideDownloadChapter
            :download="currentDownload"
            v-if="currentDownload.type === 'chapter'"
          />
          <SideDownloadChapters
            :download="currentDownload"
            v-if="currentDownload.type === 'chapters'"
          />
          <SideDownloadVolume
            :download="currentDownload"
            v-if="currentDownload.type === 'volume'"
          />
        </div>

        <div v-if="queue.length > 0" class="text-center">
          <h2>En attente</h2>
          <div v-for="queueElement in queue" :key="queueElement">
            {{ queueElement }}
          </div>
        </div>

        <div v-if="done.length > 0" class="text-center">
          <h2>Terminés</h2>

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
import { ipcRenderer } from "electron";
import { computed, ref } from "vue";
import SideDownloadChapter from "./SideDownloadChapter.vue";
import SideDownloadChapters from "./SideDownloadChapters.vue";
import SideDownloadVolume from "./SideDownloadVolume.vue";

const queue = ref<string[]>(["one-piece 999", "one-piece 1000"]);
const done = ref<string[]>(["one-piece 996", "one-piece 997"]);
let currentDownload = ref<
  ChapterDownload | ChaptersDownload | VolumeDownload | null
>({
  manga: "one-piece",
  currentName: "one-piece 998",
  num: "8",
  current: 1,
  total: 2,
  percent: (1 / 2) * 100,
  type: "volume",
});
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
  @apply text-center text-xl font-manga tracking-wide bg-dark-primary mb-2;
}

span,
h3 {
  @apply block text-center;
}

.download {
  @apply h-40 border-2 border-dark-primary rounded;
}
</style>
