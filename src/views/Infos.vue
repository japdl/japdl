<template>
  <div class="infos">
    <ChooseManga @manga="getMangaContent" />
    <div v-for="(el, name) in state.content" :key="el">
      <div v-if="name === 'volumes'" class="volumes">
        <div v-for="volume in el" :key="volume.number" class="volume">
          <span>{{ volume.name }}</span>
          <img
            src="../assets/svg/download.svg"
            class="icon"
            alt="downloadIcon"
          />
          <ul class="chapters">
            <li
              class="chapter"
              v-for="chapter in volume.chapters"
              :key="chapter"
            >
              <span>{{ chapter.name }}</span>
              <BaseButton v-if="volume.chapters.length > 1">
                Télécharger
              </BaseButton>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="m-3">
        <strong>{{ name }}: </strong>{{ el }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChooseManga from "@/components/ChooseManga.vue";
import { ipcRenderer } from "electron";
import { SearchInfos } from "japscandl/js/src/utils/types";
import { reactive } from "vue";
import BaseButton from "@/components/BaseButton.vue";

const state = reactive({
  name: "" as string,
  content: {},
});

function getMangaContent(manga: SearchInfos) {
  console.log("Searching for", manga.japscan, "content");
  state.name = manga.japscan;
  ipcRenderer.send("getMangaContent", state.name);
  ipcRenderer.once("returnMangaContent", (event, arg) => {
    state.content = arg;
    console.log("Search results are:", arg);
  });
}
</script>
