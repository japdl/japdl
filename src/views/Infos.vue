<template>
  <div class="infos">
    <ChooseManga @manga="getMangaContent" />
    <div v-for="(el, name) in state.content" :key="el">
      <div v-if="name === 'volumes'" class="volumes">
        <div v-for="volume in el" :key="volume.number">
          <strong>{{ volume.name }}</strong>
          <ul class="chapters">
            <li
              class="chapter"
              v-for="chapter in volume.chapters"
              :key="chapter"
            >
              {{ chapter.name }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="field">
        <strong>{{ name }}: </strong>{{ el }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChooseManga from "@/components/Download/ChooseManga.vue";
import { ipcRenderer } from "electron";
import { defineComponent, reactive } from "vue";

export default defineComponent({
  components: { ChooseManga },
  setup() {
    const state = reactive({
      name: "" as string,
      content: {},
    });

    const methods = {
      getMangaContent(manga: string) {
        console.log("Manga:", manga);
        state.name = manga;
        ipcRenderer.send("getMangaContent", manga);
        ipcRenderer.once("returnMangaContent", (event, arg) => {
          state.content = arg;
          console.log("content reçu:", arg);
        });
      },
    };

    return {
      state,
      ...methods,
    };
  },
});
</script>

<style scoped>
.field {
  margin: 10px;
}
</style>
