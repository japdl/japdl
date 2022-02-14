<template>
  <div
    id="volume"
    class="bg-container min-w-max p-4 rounded-lg flex-1 cursor-pointer transition-all"
  >
    <p class="text-4xl font-manga tracking-wider mb-4 font-bold p-2">
      {{ props.volume.name }}
    </p>
    <div id="chapters" class="ml-14 p-2 flex flex-col gap-1">
      <ChapterView
        v-for="(chapter, index) in props.volume.chapters"
        :key="index"
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
