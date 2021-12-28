<template>
  <footer
    class="flex flex-col items-center mt-1 rounded-2xl overflow-y-scroll h-full"
  >
    <h1 class="text-2xl font-manga">Téléchargements</h1>
    <div id="downloads" class="w-full mt-2">
      <ol class="flex flex-col gap-2">
        <SideDownload v-for="(download, index) in downloads" :key="index" />
      </ol>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SideDownload from "./SideDownload.vue";

const downloads = ref(new Array(5));
</script>

<style scoped>
footer {
  background-color: var(--dark-background);
}
</style>
