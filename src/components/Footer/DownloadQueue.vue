<template>
<div
      id="queue"
      class="
        flex
        justify-center
        items-center
        border-r-2 border-current
        h-full
        pt-2
        overflow-y-scroll
      "
    >
      <ol v-if="queue.length" class="w-full">
        <span class="p-1 font-manga text-2xl">File d'attente:</span>
        <li
          v-for="(element, index) in queueToShow"
          :key="element.toString()"
          class="p-1 rounded-xl flex flex-wrap gap-4 justify-center"
        >
          <div id="item" class="flex justify-self-auto w-full bg-gray-700">
            <span id="num" class="text-xl px-1 self-start">{{index+1}} -</span>
            <div id="name">{{element}}</div>
          </div>
        </li>
        <li class="p-1 rounded-xl" v-if="!isShowingEverything">{{ howManyLeftText }}</li>
      </ol>
      <h1 v-else>La file d'attente de téléchargement est vide</h1>
    </div>
</template>

<script lang="ts" setup>import { ipcRenderer } from 'electron';
import { computed, ref } from 'vue';

const queue = ref<string[]>([
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
  "shingeki-no-kyojin volume 1-25",
]);

const queueToShow = computed(() => {
  if (queue.value.length > 5) {
    const newQueue = queue.value.slice(0, 5);
    return newQueue;
  }
  return queue.value;
});

const isShowingEverything = computed(
  () => queueToShow.value.length === queue.value.length
);

const howManyLeftText = computed(
  () => {
    const newCount = queue.value.length - 5;
    return `et ${newCount} autre${newCount > 1 ? "s" : ""}`;
  }
);

ipcRenderer.on("update-queue", (event, newQueue) => {
  console.log("Receiving new queue", newQueue);
  queue.value = newQueue;
});


</script>