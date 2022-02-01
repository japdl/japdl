<template>
  <ImageFolder class="w-20 mr-2" />
  <span class="w-full">{{ baseName }}</span>
  <span id="nbOfPages" class="text-xs w-full text-right"
    >{{ numberOfImages() }} images</span
  >
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import ImageFolder from "../Images/ImageFolder.vue";
import fs from "fs";
import path from "path";
import { computed } from "vue";

const props = defineProps<{
  file: {
    path: string;
    stat: fs.Stats;
  };
}>();

function numberOfImages() {
  return fs.readdirSync(props.file.path).length;
}

const baseName = computed(() => path.basename(props.file.path));
</script>
