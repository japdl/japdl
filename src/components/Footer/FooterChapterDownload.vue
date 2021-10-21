<template>
  <h1 class="text-center mr-1">{{ props.download.name }}</h1>
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
