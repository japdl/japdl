<template>
  <h1 class="text-center">{{ props.download.name }}</h1>
  <h2 class="text-center">{{ props.download.currentName }}</h2>
  <LoadingBar :done="props.download.percent" />
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import LoadingBar from "../LoadingBar.vue";
const props = defineProps({
  download: {
    type: Object,
    required: true,
  },
});
</script>
