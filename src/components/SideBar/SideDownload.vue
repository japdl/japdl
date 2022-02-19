<template>
  <h2
    class="text-center text-xl font-manga tracking-wide bg-dark-primary text-white"
  >
    En cours
  </h2>
  <SideDownloadChapter
    :download="download"
    v-if="download.type === 'chapter'"
  />
  <SideDownloadChapters
    :download="download"
    v-if="download.type === 'chapters'"
  />
  <SideDownloadVolume :download="download" v-if="download.type === 'volume'" />
  <SideDownloadVolumes
    :download="download"
    v-if="download.type === 'volumes'"
  />
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import SideDownloadChapter from "./SideDownloadChapter.vue";
import SideDownloadChapters from "./SideDownloadChapters.vue";
import SideDownloadVolume from "./SideDownloadVolume.vue";
import SideDownloadVolumes from "./SideDownloadVolumes.vue";
import { SideBarDownload } from "@/utils/downloadHandler";

defineProps<{
  download: SideBarDownload;
}>();
</script>
