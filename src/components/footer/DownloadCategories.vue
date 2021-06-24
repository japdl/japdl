<template>
  <div id="downloadWatch">
    <div
      class="downloadCategory"
      v-for="(downloads, name) in currentDownloads"
      :key="name"
    >
      <p>{{ name }}</p>
      <button class="openFolder basic" @click="openMangaFolder(name)">
        Ouvrir le dossier du manga
      </button>
      <DownloadCategory
        :downloads="downloads"
        @remove="removeDownload($event, name)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DownloadCategory from "@/components/footer/DownloadCategory.vue";
import { ipcRenderer } from "electron";
export default defineComponent({
  props: ["currentDownloads"],
  emits: ["remove"],
  components: { DownloadCategory },
  methods: {
    removeDownload(index: number, name: string): void {
      this.$emit("remove", { name, index });
    },
    openMangaFolder(mangaName: string) {
      ipcRenderer.send("openMangaFolder", mangaName);
    },
  },
});
</script>

<style scoped>
.downloadCategory {
  border: grey solid 1px;
}
.downloadCategory h4 {
  text-align: left;
}

button.openFolder {
  white-space: pre;
}
</style>
