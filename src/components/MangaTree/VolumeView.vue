<template>
  <div id="volume">
    <p class="text-2xl mb-4 font-bold">{{ props.volume.name }}</p>
    <div id="chapters" class="pl-4">
      <ChapterView
        v-for="chapter in props.volume.chapters"
        :key="chapter.name"
        :chapter="chapter"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import { Volume } from "../../../../japscandl/js/src/utils/types";
import ChapterView from "./ChapterView.vue";
const props = defineProps<{
  volume: Volume;
}>();
</script>
