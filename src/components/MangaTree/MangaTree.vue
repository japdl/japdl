<template>
  <div class="container mx-auto">
    <h1 v-if="!content">Chargement des informations du manga...</h1>
    <div v-else>
      <div id="sortBy" class="ml-auto">
        Trier par ordre
        <select
          class="text-black"
          v-model="sortMode"
          @change="handleSortChange"
        >
          <option value="ascending">croissant</option>
          <option value="descending">décroissant</option>
        </select>
      </div>
      <div id="volumes" class="flex flex-col gap-4">
        <VolumeView
          id="volume"
          v-for="volume in content.volumes"
          :key="volume.name"
          :volume="volume"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { startLoading, stopLoading } from "@/utils/loadingState";
import { defineProps, defineEmits } from "@vue/runtime-core";
import { ipcRenderer } from "electron";
import { MangaContent } from "japscandl/js/src/utils/types";
import { ref } from "vue";
import VolumeView from "./VolumeView.vue";
const props = defineProps<{
  manga: string;
}>();

startLoading();
const sortMode = ref("ascending");

const content = ref<null | MangaContent>(null);

ipcRenderer.send("getMangaContent", props.manga);
ipcRenderer.on("returnMangaContent", (event, arg) => {
  content.value = arg;
  stopLoading();
});

function handleSortChange() {
  if (!content.value) return;
  const volumes = content.value.volumes;
  volumes.sort((a, b) => {
    // sort by volume number
    if (sortMode.value === "ascending") {
      return +a.number - +b.number;
    } else {
      return +b.number - +a.number;
    }
  });
}
</script>
