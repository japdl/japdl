<template>
  <footer class="flex justify-center items-center min-h-screen rounded-t-2xl">
    <h1
      class="flex justify-center items-center"
      v-if="download === null && !loading"
    >
      <span>Aucun téléchargement en cours</span>
    </h1>
    <div v-if="loading">Initialisation du téléchargement...</div>
    <div v-if="download !== null && !loading" class="w-full">
      <div
        class="
          w-full
          flex flex-col
          gap-5
          justify-center
          items-center
          border-b-2 border-black
        "
      >
        <div>{{ download.manga }}</div>
        <div>{{ download.chapter }}</div>
        <div>{{ download.pageCurrent }} / {{ download.pageTotal }}</div>
        <LoadingBar :done="download.getProgressPercent()" />
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { progress } from "@/utils/progress";
import { ref } from "@vue/reactivity";
import { ipcRenderer } from "electron";
import LoadingBar from "../LoadingBar.vue";
import Loading from "../Loading.vue";

const download = ref(null as null | ChapterDownload);
const loading = ref(false);

class ChapterDownload {
  constructor(
    public manga: string,
    public chapter: number,
    public pageCurrent: number,
    public pageTotal: number
  ) {}

  getProgressPercent(): number {
    return progress(this.pageCurrent, this.pageTotal);
  }
}

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

<style scoped>
footer {
  min-height: fit-content;
  background-color: var(--container);
}
</style>
