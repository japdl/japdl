<template>
  <input v-model="state.name" type="text" /> chapter
  <input v-model="state.number" type="number" />
  <button @click="downloadManga">Download</button>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { defineComponent, reactive } from "vue";
export default defineComponent({
  setup() {
    const state = reactive({
      name: "" as string,
      number: 0 as number,
    });
    function downloadManga() {
      ipcRenderer.send("mockDownloadChapter", {
        name: state.name,
        number: state.number,
      });
    }
    return { downloadManga, state };
  },
});
</script>
