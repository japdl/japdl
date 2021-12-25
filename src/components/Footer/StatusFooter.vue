<template>
  <footer
    class="flex justify-center items-center min-h-screen rounded-t-2xl w-full"
  >
  <DownloadQueue class="w-1/5" />
  <DownloadStatus class="w-4/5" />
  </footer>
</template>

<script lang="ts" setup>
import DownloadQueue from "./DownloadQueue.vue";
import DownloadStatus from "./DownloadStatus.vue";
</script>

<style scoped>
footer {
  min-height: fit-content;
  background-color: var(--container);
}
</style>
