<template>
  <div class="flex flex-col justify-around overflow-auto p-2 text-center">
    <h2 class="mb-1 font-manga text-lg tracking-wide">
      <p class="text-xl">{{ download.manga }}</p>
      <p>volume {{ download.num }}</p>
    </h2>
    <div v-if="displayChapterDetails">
      <p>chapitre {{ download.currentName }}</p>
      ({{ download.current }} / {{ download.total }})
    </div>
    <LoadingBar class="my-1" :done="download.percent" :show="false" />
    <span>{{ download.percent.toFixed(2) }}%</span>
  </div>
</template>

<script lang="ts" setup>
import LoadingBar from "../LoadingBar.vue";
import { defineProps } from "@vue/runtime-core";
import { VolumeDownload } from "@/utils/downloadHandler/volume";
import { computed } from "vue";

const props = defineProps<{
  download: VolumeDownload;
}>();

const displayChapterDetails = computed(() => {
  const isStillLoading = props.download.total && props.download.current;
  return isStillLoading && !props.download.currentName.includes("volume");
});
</script>
