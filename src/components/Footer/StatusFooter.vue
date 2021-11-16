<template>
  <footer class="flex justify-center items-center min-h-screen rounded-t-2xl">
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
        <h1 v-else>Le téléchargement {{ download }} n'est pas reconnu</h1>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { progress } from "@/utils/progress";
import { ipcRenderer, IpcRendererEvent } from "electron";
import { MangaAttributes } from "japscandl/js/src/utils/types";
import { ref } from "vue";
import FooterChapterDownload from "./FooterChapterDownload.vue";
import FooterChaptersDownload from "./FooterChaptersDownload.vue";

export type Download = ChapterDownload | ChaptersDownload;

export type DownloadType = "chapter" | "chapters" | "volumes";

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
];

const downloads = ref([] as Download[]);

function removeDownload(_event: IpcRendererEvent, arg: { parentName: string }) {
  // after 2 seconds, remove download from list
  setTimeout(() => {
    downloads.value = downloads.value.filter(
      (el) => el.name !== arg.parentName
    );
  }, 2000);
}

function getBasic(type: DownloadType): Download {
  if (type === "chapter") {
    return {
      name: "",
      percent: 0,
      type,
    } as ChapterDownload;
  } else if (type === "chapters") {
    return {
      name: "",
      percent: 0,
      type,
      currentName: "",
    } as ChaptersDownload;
  } else {
    throw new Error("Type not recognized, received: " + type);
  }
}

function handleSetupFromType(type: DownloadType) {
  // registers type and return a function that will be handled by ipcRenderer event
  // with pre-defined type
  return (_event: IpcRendererEvent, arg: { parentName: string }) => {
    const defaultDownloadObject = getBasic(type);
    defaultDownloadObject.name = arg.parentName;
    const alreadyExists = downloads.value.find(
      (value) => value.name === arg.parentName
    );
    if (alreadyExists) {
      Object.assign(alreadyExists, defaultDownloadObject);
    } else {
      downloads.value.push(defaultDownloadObject);
    }
  };
}

function handlePageUpdateFromType(type: DownloadType) {
  return (
    _event: IpcRendererEvent,
    arg: {
      attributes: MangaAttributes;
      total: number;
      parentName: string;
      downloadName: string;
    }
  ) => {
    const percent = progress(+arg.attributes.page, arg.total);
    const defaultDownloadObject = getBasic(type);
    defaultDownloadObject.name = arg.parentName;
    if (type === "chapters") {
      (defaultDownloadObject as ChaptersDownload).currentName =
        arg.downloadName;
    }
    defaultDownloadObject.percent = percent;
    const currentDownload = downloads.value.find(
      (value) => value.name === arg.parentName
    );
    if (currentDownload) {
      Object.assign(currentDownload, defaultDownloadObject);
    } else {
      downloads.value.push(defaultDownloadObject);
    }
  };
}

ipcRenderer.on("downloadChapterSetup", handleSetupFromType("chapter"));
ipcRenderer.on("downloadChaptersSetup", handleSetupFromType("chapters"));
ipcRenderer.on("downloadVolumesSetup", handleSetupFromType("volumes"));

ipcRenderer.on(
  "downloadChapterUpdatePage",
  handlePageUpdateFromType("chapter")
);

ipcRenderer.on(
  "downloadChaptersUpdatePage",
  handlePageUpdateFromType("chapters")
);

ipcRenderer.on("downloadChapterEnd", removeDownload);
ipcRenderer.on("downloadChaptersEnd", removeDownload);
</script>

<style scoped>
footer {
  min-height: fit-content;
  background-color: var(--container);
}
</style>
