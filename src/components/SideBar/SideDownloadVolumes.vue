<template>
  <div class="flex flex-col justify-around overflow-auto p-2 text-center">
    <h2 class="mb-1 font-manga text-lg tracking-wide">
      <p class="text-xl">{{ download.manga }}</p>
      <p>volumes {{ download.start }} à {{ download.end }}</p>
      <p>volume {{ download.currentVolume }}</p>
    </h2>
    <div v-if="displayChapterDetails">
      <p v-if="download.currentChapter">
        chapitre {{ download.currentChapter }}
      </p>
      <p>({{ download.current }} / {{ download.total }})</p>
    </div>
    <LoadingBar class="my-1" :done="download.percent" :show="false" />
    <span>{{ download.percent.toFixed(2) }}%</span>
  </div>
</template>

<script lang="ts" setup>
import LoadingBar from "../LoadingBar.vue";
import { defineProps } from "@vue/runtime-core";
import { VolumesDownload } from "@/utils/downloadHandler/volumes";
import { computed } from "vue";

const props = defineProps<{
  download: VolumesDownload;
}>();

const displayChapterDetails = computed(() => {
  const isStillLoading = props.download.total && props.download.current;
  return isStillLoading && !props.download.currentChapter.includes("volume");
});
</script>
