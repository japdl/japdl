<template>
  <footer
    class="bg-gray-900 w-full h-full overflow-y-hidden flex justify-center"
  >
    <h1 v-if="!downloads.length">No Downloads yet</h1>
    <div v-else class="w-3/4">
      <div
        v-for="(download, index) in downloads"
        :key="index"
        class="border-2 border-black w-full hover:bg-blue-600 flex items-center"
      >
        <h1 class="text-center">{{ download.name }}</h1>
        <LoadingBar :done="download.percent" />
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import progress from "@/utils/progress";
import { ipcRenderer } from "electron";
import { MangaAttributes } from "japscandl/js/src/utils/types";
import { ref } from "vue";
import LoadingBar from "../LoadingBar.vue";

type Download = {
  name: string;
  percent: number;
};

const downloads = ref([] as Download[]);

ipcRenderer.on(
  "downloadChapterSetup",
  (
    event,
    arg: {
      manga: string;
      chapter: number;
      downloadName: string;
    }
  ) => {
    const download: Download = {
      name: arg.downloadName,
      percent: 0,
    };
    downloads.value.push(download);
  }
);

ipcRenderer.on(
  "downloadChapterUpdatePage",
  (
    _,
    arg: {
      attributes: MangaAttributes;
      total: number;
      downloadName: string;
    }
  ) => {
    const percent = Math.round(progress(+arg.attributes.page, arg.total));
    console.log(arg.downloadName, percent);
    const currentDownload = downloads.value.find(
      (value) => value.name === arg.downloadName
    );
    if (!currentDownload) {
      downloads.value.push({ name: arg.downloadName, percent: percent });
    } else {
      currentDownload.percent = percent;
    }
  }
);

ipcRenderer.on("downloadChapterEnd", (event, arg) => {
  // after 2 seconds, remove download from list
  setTimeout(() => {
    downloads.value = downloads.value.filter(
      (el) => el.name !== arg.downloadName
    );
  }, 2000);
});
</script>
