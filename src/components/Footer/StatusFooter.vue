<template>
  <footer
    class="bg-gray-900 w-full h-full overflow-y-hidden flex justify-center"
  >
    <h1 v-if="!downloads.length">No Downloads yet</h1>
    <div v-else class="w-3/4">
      <div
        v-for="(download, index) in downloads"
        :key="index"
        class="border-2 border-black w-full hover:bg-blue-600 flex items-center"
      >
        <h1 class="text-center">{{ download.name }}</h1>
        <LoadingBar :done="download.percent" />
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import LoadingBar from "../LoadingBar.vue";

type Download = {
  name: string;
  percent: number;
};

const mockData: Download[] = [
  {
    name: "One Piece volume 1",
    percent: 50,
  },
  {
    name: "One Punch Man chapitre 122",
    percent: 20,
  },
];

const downloads = ref(mockData);
</script>
