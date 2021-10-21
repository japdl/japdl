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
import { ipcRenderer, IpcRendererEvent } from "electron";
import { ref } from "vue";
import FooterChapterDownload from "./FooterChapterDownload.vue";
import FooterChaptersDownload from "./FooterChaptersDownload.vue";
import FooterVolumesDownload from "./FooterVolumesDownload.vue";

export type Download = ChapterDownload | ChaptersDownload | VolumesDownload;

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

function removeDownload(_event: any, arg: { parentName: string }) {
  // after 2 seconds, remove download from list
  setTimeout(() => {
    downloads.value = downloads.value.filter(
      (el) => el.name !== arg.parentName
    );
  }, 2000);
}

function handleFromType(type: DownloadType) {
  // registers type and return a function that will be handled by ipcRenderer event
  // with pre-defined type
  return (_event: IpcRendererEvent, arg: { parentName: string }) => {
    const defaultDownloadObject = getBasic(type, arg.parentName);
    const alreadyExists = downloads.value.find(
      (value) => value.name === arg.parentName
    );
    if (alreadyExists) {
      Object.assign(alreadyExists, defaultDownloadObject);
    } else {
      const download = defaultDownloadObject;
      downloads.value.push(download);
    }
  };
}

function getBasic(type: DownloadType, name: string): Download {
  if (type === "chapter") {
    return {
      name,
      percent: 0,
      type,
    } as ChapterDownload;
  } else if (type === "chapters") {
    return {
      name,
      type,
      currentName: "",
      percent: 0,
    } as ChaptersDownload;
  } else if (type === "volumes") {
    return {
      name,
      type,
      currentDownloadName: "",
      currentVolumeName: "",
      percent: 0,
    };
  } else {
    throw new Error("Type non reconnu, reçu " + type);
  }
}

ipcRenderer.on("downloadChapterSetup", handleFromType("chapter"));
ipcRenderer.on("downloadChaptersSetup", handleFromType("chapters"));
ipcRenderer.on("downloadVolumesSetup", handleFromType("volumes"));

ipcRenderer.on("downloadChapterUpdatePage", (_, arg) => {
  const percent = progress(+arg.attributes.page, arg.total);
  const currentDownload = downloads.value.find(
    (value) => value.name === arg.parentName
  );
  if (!currentDownload) {
    downloads.value.push({
      name: arg.parentName,
      percent: percent,
      type: "chapter",
    });
  } else {
    currentDownload.percent = percent;
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

ipcRenderer.on("downloadChapterEnd", removeDownload);
ipcRenderer.on("downloadChaptersEnd", removeDownload);
ipcRenderer.on("downloadVolumesEnd", removeDownload);
</script>

<style scoped>
footer {
  min-height: fit-content;
}
</style>
