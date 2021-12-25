<template>
  <div id="download" class="h-full">
    <h1
      v-if="download === null && !loading"
      class="flex justify-center items-center"
    >
      <span>Aucun téléchargement en cours</span>
    </h1>
    <div v-if="loading" class="p-4">Initialisation du téléchargement...</div>
    <div v-if="download !== null && !loading" class="w-full h-full flex">
      <ChapterDownloadVue v-if="type === 'chapter'" />
      <ChaptersDownloadVue v-else-if="type === 'chapters'" />
      <VolumeDownloadVue v-else-if="type === 'volume'" />
      <VolumesDownloadVue v-else-if="type === 'volumes'" />
      <div v-else>Type de téléchargement inconnu. ({{ download }})</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChapterDownloadVue from "./ChapterDownload.vue";
import ChaptersDownloadVue from "./ChaptersDownload.vue";
import VolumeDownloadVue from "./VolumeDownload.vue";
import VolumesDownloadVue from "./VolumesDownload.vue";

import { progress } from "@/utils/progress";
import { ipcRenderer } from "electron";
import { computed, ref } from "vue";

class ChapterDownload {
  constructor(
    public manga: string,
    public chapter: number,
    public pageCurrent: number,
    public pageTotal: number
  ) {}

  getPageProgress(): number {
    return progress(this.pageCurrent, this.pageTotal);
  }
}

class ChaptersDownload extends ChapterDownload {
  constructor(
    manga: string,
    chapter: number,
    pageCurrent: number,
    pageTotal: number,
    public chapterStart: number,
    public chapterEnd: number,
    public chapterIndex: number,
    public chapterTotal: number
  ) {
    super(manga, chapter, pageCurrent, pageTotal);
  }

  getChapterProgress(): number {
    return progress(this.chapterStart, this.chapterEnd);
  }

}

class VolumeDownload extends ChaptersDownload {

}

class VolumesDownload extends VolumeDownload {}

const type = computed(() => {
  if (download.value instanceof ChapterDownload) {
    return "chapter";
  } else if (download.value instanceof ChaptersDownload) {
    return "chapters";
  } else if (download.value instanceof VolumeDownload){
    return "volume";
  } else if (download.value instanceof VolumesDownload){
    return "volumes";
  } else {
    return "unknown";
  }
});

const dummy = new ChapterDownload("one-piece", 998, 8, 11);

const download = ref<null | ChapterDownload>(dummy);
const loading = ref(false);

ipcRenderer.on("loading", () => {
  loading.value = true;
});

ipcRenderer.on("chapter-start", (event, data) => {
  loading.value = false;
  const newDownload = new ChapterDownload(
    data.manga,
    data.attributes.chapter,
    data.attributes.page,
    data.total
  );
  download.value = newDownload;
});

ipcRenderer.on("chapter-page", (event, data) => {
  if (download.value) {
    download.value.pageCurrent = data.page;
    download.value.pageTotal = data.total;
  }
});

ipcRenderer.on("chapter-done", () => {
  download.value = null;
});
</script>
