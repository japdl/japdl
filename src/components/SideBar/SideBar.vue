<template>
  <div
    id="container"
    class="
      flex flex-col
      items-center
      w-72
      h-full
      overflow-hidden
      text-gray-300
      mt-1
      rounded
    "
  >
    <h1 class="font-manga text-3xl my-2">Téléchargements</h1>
    <div id="downloads" class="w-full flex flex-col gap-1">
      <SideChapter
      class="download"
        :current="3"
        :total="11"
        name="one-piece chapitre 998"
      />
      <div class="download chapters">
        <h2>one-piece chapitre 1000-1009</h2>
        <h3>one-piece chapitre 1002</h3>
        <span>3 / 10</span>
        <LoadingBar :done="(3 / 10) * 100" :show="false" />
      </div>
      <div class="download volume">
        <h2>one-piece volume 99</h2>
        <h3>one-piece chapitre 1004</h3>
        <span>2 / 8</span>
        <LoadingBar :done="(2 / 8) * 100" :show="false" />
      </div>
      <div class="download volumes">
        <h2>one-piece volume 99-100</h2>
        <h3 class="font-manga">one-piece volume 99</h3>
        <h3>one-piece chapitre 1005</h3>
        <span>1/2</span>
        <LoadingBar :done="(1 / 2) * 100" :show="false" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import LoadingBar from "../LoadingBar.vue";
import SideChapter from "./SideChapter.vue";

const downloads = ref(new Array(5));
</script>

<style scoped>
#container {
  background-color: var(--dark-background);
}

h2 {
  @apply text-center text-lg font-manga;
}

span,
h3 {
  @apply block text-center;
}

.download {
  @apply h-32 border-2 border-dark-primary rounded;
}
</style>
