<template>
  <Read class="w-10 mr-2" />
  <span class="font-bold w-full">{{ baseName }}</span>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import Read from "../Images/Read.vue";
import fs from "fs";
import path from "path";
import { computed } from "vue";

const props = defineProps<{
  file: {
    path: string;
    stat: fs.Stats;
  };
}>();

const baseName = computed(() => path.basename(props.file.path));
</script>
