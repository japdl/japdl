<template>
  <aside
    id="container"
    class="
      flex flex-col
      items-center
      w-72
      h-full
      overflow-hidden
      text-gray-300
      rounded
    "
  >
    <h1 class="font-manga text-3xl my-2">Téléchargements</h1>
    <div id="downloads" class="w-full flex flex-col gap-1">
      <div class="border-b-2 border-t-2 text-center text-xl">En cours</div>
      <SideDownload
        v-if="currentDownload"
        :fullname="currentDownload.fullname"
        :current="currentDownload.current"
        :total="currentDownload.total"
      />
      <div class="border-b-2 border-t-2 text-center text-xl">En attente</div>
      <div v-for="queueElement in queue" :key="queueElement">
        {{ queueElement }}
      </div>
      <div class="border-b-2 border-t-2 text-center text-xl">Terminés</div>
      <div v-for="doneElement in done" :key="doneElement">
        {{ doneElement }}
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { ref } from "vue";
import SideDownload from "./SideDownload.vue";

type OngoingDownload = {
  fullname: string;
  current: number;
  total: number;
  chapter?: string;
  volume?: string;
};

const queue = ref<string[]>([]);
const done = ref<string[]>([]);
let currentDownload = ref<OngoingDownload | null>(null);

ipcRenderer.on("update-queue", (event, data) => {
  queue.value = data;
});

ipcRenderer.on("update-done", (event, data) => {
  done.value = data;
});
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
