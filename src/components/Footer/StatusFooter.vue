<template>
  <footer class="bg-gray-900 flex justify-center items-center min-h-screen">
    <h1 class="flex justify-center items-center" v-if="!downloads.length">
      <span>Aucun téléchargement en cours</span>
    </h1>
    <div v-else class="w-full">
      <div
        v-for="(download, index) in downloads"
        :key="index"
        class="w-full flex items-center border-b-2 border-black"
      >
        <FooterChapterDownload
          v-if="download.type === 'chapter'"
          :download="download"
        />
        <FooterChaptersDownload
          v-else-if="download.type === 'chapters'"
          :download="download"
        />
        <FooterVolumesDownload
          v-else-if="download.type === 'volumes'"
          :download="download"
        />
        <h1 v-else>Le téléchargement {{ download }} n'est pas reconnu</h1>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { progress } from "@/utils/progress";
import { ipcRenderer } from "electron";
import { ref } from "vue";
import FooterChapterDownload from "./FooterChapterDownload.vue";
import FooterChaptersDownload from "./FooterChaptersDownload.vue";
import FooterVolumesDownload from "./FooterVolumesDownload.vue";

export type Download = ChapterDownload | ChaptersDownload | VolumesDownload;

export type ChapterDownload = {
  name: string;
  percent: number;
  type: "chapter";
};

export type ChaptersDownload = {
  name: string;
  currentName: string;
  percent: number;
  type: "chapters";
};

export type VolumesDownload = {
  name: string;
  currentVolumeName: string;
  currentDownloadName: string;
  percent: number;
  type: "volumes";
};

const mockData: Download[] = [
  {
    name: "one-piece 1028",
    percent: 80,
    type: "chapter",
  },
  {
    name: "one-piece 998-999",
    currentName: "one-piece 998",
    percent: 50,
    type: "chapters",
  },
  {
    name: "one-piece volume 1",
    currentName: "one-piece volume-1",
    percent: 20,
    type: "chapters",
  },
  {
    name: "one-piece volume 1-2",
    currentVolumeName: "one-piece volume 1",
    currentDownloadName: "one-piece volume-1",
    percent: 20,
    type: "volumes",
  },
];

const downloads = ref([] as Download[]);

// chapter
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
    const alreadyExists = downloads.value.find(
      (value) => value.name === arg.downloadName
    );
    if (alreadyExists) {
      alreadyExists.percent = 0;
    } else {
      const download: ChapterDownload = {
        name: arg.downloadName,
        percent: 0,
        type: "chapter",
      };
      downloads.value.push(download);
    }
  }
);

ipcRenderer.on("downloadChapterUpdatePage", (_, arg) => {
  const percent = progress(+arg.attributes.page, arg.total);
  const currentDownload = downloads.value.find(
    (value) => value.name === arg.downloadName
  );
  if (!currentDownload) {
    downloads.value.push({
      name: arg.downloadName,
      percent: percent,
      type: "chapter",
    });
  } else {
    currentDownload.percent = percent;
  }
});

ipcRenderer.on("downloadChapterEnd", (event, arg) => {
  // after 2 seconds, remove download from list
  setTimeout(() => {
    downloads.value = downloads.value.filter(
      (el) => el.name !== arg.downloadName
    );
  }, 2000);
});

// end chapter

// chapters

ipcRenderer.on("downloadChaptersSetup", (event, arg) => {
  const alreadyExists = downloads.value.find(
    (value) => value.name === arg.downloadName
  ) as ChaptersDownload;
  if (alreadyExists) {
    alreadyExists.percent = 0;
    alreadyExists.currentName = "";
  } else {
    const download: ChaptersDownload = {
      name: arg.parentName,
      currentName: "",
      percent: 0,
      type: "chapters",
    };
    downloads.value.push(download);
  }
});

ipcRenderer.on("downloadChaptersUpdateChapter", (event, arg) => {
  console.log("received in updateChapter", arg);
  const currentDownload = downloads.value.find(
    (value) => value.name === arg.parentName
  ) as ChaptersDownload;
  if (!currentDownload) {
    downloads.value.push({
      name: arg.parentName,
      currentName: arg.downloadName,
      percent: 0,
      type: "chapters",
    });
  } else {
    currentDownload.currentName = arg.downloadName;
  }
});

ipcRenderer.on("downloadChaptersUpdatePage", (event, arg) => {
  const percent = progress(+arg.attributes.page, arg.total);
  const currentDownload = downloads.value.find(
    (value) => value.name === arg.parentName
  ) as ChaptersDownload;
  if (currentDownload) {
    currentDownload.percent = percent;
    currentDownload.currentName = arg.downloadName;
  } else {
    downloads.value.push({
      name: arg.parentName,
      currentName: arg.downloadName,
      percent,
      type: "chapters",
    } as ChaptersDownload);
  }
});

ipcRenderer.on("downloadChaptersEnd", (event, arg) => {
  // after 2 seconds, remove download from list
  setTimeout(() => {
    downloads.value = downloads.value.filter(
      (el) => el.name !== arg.parentName
    );
  }, 2000);
});

// end chapters
</script>

<style scoped>
footer {
  min-height: fit-content;
}
</style>
