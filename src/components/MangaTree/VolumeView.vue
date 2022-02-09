<template>
  <div
    id="volume"
    class="bg-container min-w-max p-4 rounded-lg flex-1 cursor-pointer transition-all"
  >
    <p
      class="text-2xl mb-4 font-bold text-center p-2 border-l-4 border-dark-primary"
    >
      {{ props.volume.name }}
    </p>
    <div id="chapters" class="ml-14 p-2 border-l-4 border-primary">
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
