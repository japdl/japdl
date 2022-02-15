<template>
  <div class="flex flex-col justify-around overflow-auto p-2 text-center">
    <h2 class="mb-1 font-manga text-lg tracking-wide">
      <p class="text-xl">{{ download.manga }}</p>

      <p>chapitres {{ download.start }} à {{ download.end }}</p>
    </h2>
    <div v-if="download.total && download.current">
      <p>chapitre {{ download.currentChapter }}</p>
      ({{ download.current }} / {{ download.total }})
    </div>
    <LoadingBar class="my-1" :done="download.percent" :show="false" />
    <span>{{ download.percent.toFixed(2) }}%</span>
  </div>
</template>

<script lang="ts" setup>
import LoadingBar from "../LoadingBar.vue";
import { defineProps } from "@vue/runtime-core";
import { ChaptersDownload } from "@/utils/downloadHandler/chapters";

defineProps<{
  download: ChaptersDownload;
}>();
</script>
