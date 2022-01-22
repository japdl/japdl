<template>
  <aside
    class="flex flex-col bg-dark-background items-center w-72 h-full overflow-y-auto rounded"
  >
    <h1 class="font-manga text-3xl my-2">Téléchargements</h1>
    <div id="downloads" class="w-full flex flex-col gap-1 h-full">
      <h1 class="text-center opacity-70 pt-5" v-if="!displaysAnything">
        Aucun téléchargement en cours
      </h1>
      <div
        v-if="currentDownload"
        class="border-b-2 border-t-2 text-center text-xl border-current"
      >
        <h2>En cours</h2>
        <SideDownload
          v-if="currentDownload"
          :fullname="currentDownload.fullname"
          :chapter="currentDownload.chapter"
          :current="currentDownload.current"
          :total="currentDownload.total"
          :percent="currentDownload.percent"
        />
      </div>

      <div
        v-if="queue.length > 0"
        class="border-b-2 border-t-2 text-center text-xl border-current"
      >
        <h2>En attente</h2>
        <div v-for="queueElement in queue" :key="queueElement">
          {{ queueElement }}
        </div>
      </div>

      <div
        v-if="done.length > 0"
        class="border-b-2 border-t-2 text-center text-xl border-current"
      >
        <h2>Terminés</h2>

        <div v-for="doneElement in done" :key="doneElement">
          {{ doneElement }}
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { OngoingDownload } from "@/utils/downloadHandler/types";
import { ipcRenderer } from "electron";
import { computed, ref } from "vue";
import SideDownload from "./SideDownload.vue";

const queue = ref<string[]>([]);
const done = ref<string[]>([]);
let currentDownload = ref<OngoingDownload | null>(null);
const displaysAnything = computed(
  () =>
    queue.value.length + done.value.length > 0 || currentDownload.value !== null
);

ipcRenderer.on("update-queue", (event, data: string[]) => {
  data.shift();
  queue.value = data;
});

ipcRenderer.on("update-current", (event, data: OngoingDownload) => {
  currentDownload.value = data;
});

ipcRenderer.on("update-done", (event, data) => {
  done.value = data;
});
</script>

<style scoped>
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
