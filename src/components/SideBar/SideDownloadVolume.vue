<template>
  <div class="flex flex-col justify-around overflow-auto p-2 text-center">
    <h2 class="mb-1 font-manga text-lg tracking-wide">
      <span class="block">{{ download.manga }}</span>
      volume {{ download.num }}
    </h2>
    <span v-if="displayChapterDetails"
      >chapitre {{ download.currentName }} ({{ download.current }} /
      {{ download.total }})</span
    >
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
