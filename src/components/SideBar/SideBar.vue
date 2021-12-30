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
      <SideDownload
        class="download"
        :current="3"
        :total="11"
        fullname="one-piece chapitre 998"
      />
      <SideDownload
        class="download"
        :current="3"
        :total="10"
        fullname="one-piece chapitre 1000-1009"
        chapter="one-piece chapitre 1002"
      />
      <SideDownload
        class="download"
        :current="2"
        :total="8"
        fullname="one-piece volume 99"
        chapter="one-piece chapitre 1004"
      />
      <SideDownload
        class="download"
        fullname="one-piece volume 99-100"
        volume="one-piece volume 99"
        chapter="one-piece chapitre 1005"
        :current="1"
        :total="2"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import LoadingBar from "../LoadingBar.vue";
import SideDownload from "./SideDownload.vue";

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
  @apply h-40 border-2 border-dark-primary rounded;
}
</style>
