<template>
  <footer
    class="bg-gray-900 w-full h-full overflow-y-hidden flex justify-center"
  >
    <h1 v-if="!downloads.length">No Downloads yet</h1>
    <div v-else class="w-3/4">
      <div
        v-for="(download, index) in downloads"
        :key="index"
        class="w-full flex items-center"
      >
        <FooterChapterDownload
          v-if="download.type === 'chapter'"
          :download="download"
        />
        <FooterChaptersDownload
          v-if="download.type === 'chapters'"
          :download="download"
        />
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import progress from "@/utils/progress";
import { ipcRenderer } from "electron";
import { ref } from "vue";
import FooterChapterDownload from "./FooterChapterDownload.vue";
import FooterChaptersDownload from "./FooterChaptersDownload.vue";

type Download =
  | ChapterDownload
  | ChaptersDownload
  | VolumeDownload
  | VolumesDownload;

type ChapterDownload = {
  name: string;
  percent: number;
  type: "chapter";
};

type ChaptersDownload = {
  name: string;
  currentName: string;
  percent: number;
  type: "chapters";
};

type VolumeDownload = {
  name: string;
  currentName: string;
  percent: number;
  type: "volume";
};

type VolumesDownload = {
  name: string;
  currentName: string;
  percent: number;
  type: "volumes";
};

const mockData: Download[] = [
  {
    name: "one-piece 998-999",
    currentName: "one-piece 998",
    percent: 50,
    type: "chapters",
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
    const download: ChapterDownload = {
      name: arg.downloadName,
      percent: 0,
      type: "chapter",
    };
    downloads.value.push(download);
  }
);

ipcRenderer.on("downloadChapterUpdatePage", (_, arg) => {
  const percent = Math.round(progress(+arg.attributes.page, arg.total));
  console.log("downloadChapterEvent:", arg.downloadName, percent);
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
  const download: ChaptersDownload = {
    name: arg.parentName,
    currentName: "",
    percent: 0,
    type: "chapters",
  };
  downloads.value.push(download);
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
  const percent = Math.round(progress(+arg.attributes.page, arg.total));
  console.log(arg);
  const currentDownload = downloads.value.find(
    (value) => value.name === arg.parentName
  ) as ChaptersDownload;
  console.log(currentDownload);
  if (currentDownload) {
    currentDownload.percent = percent;
    currentDownload.currentName = arg.downloadName;
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
