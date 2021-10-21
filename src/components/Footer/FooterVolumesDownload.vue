<template>
  <h1 class="text-center mr-1">{{ props.download.name }}</h1>
  <h2 class="text-center mr-1">{{ props.download.currentVolumeName }}</h2>
  <h3 class="text-center mr-1">{{ props.download.currentDownloadName }}</h3>
  <LoadingBar :done="props.download.percent" />
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import { PropType } from "vue";
import LoadingBar from "../LoadingBar.vue";
import { VolumesDownload } from "./StatusFooter.vue";
const props = defineProps({
  download: {
    type: Object as PropType<VolumesDownload>,
    required: true,
  },
});
</script>
