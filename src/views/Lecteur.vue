<template>
  <div class="reader">
    <h1>Lecteur de mangas</h1>
    <ChooseFolder @selected="handleDirectory" />
    <h3>Dossier choisi: {{ directoryPath }}</h3>
    <div class="files">
      <div
        class="file"
        v-for="file in files"
        :key="file"
        @click="startReadingAtFile(file)"
      >
        <img class="icon" :src="getPath(directoryPath, file)" />
        {{ file }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import path from "path";
import fs from "fs";
import { defineComponent } from "vue";
import ChooseFolder from "../components/ChooseFolder.vue";

export default defineComponent({
  components: { ChooseFolder },
  data() {
    return {
      directoryPath: "" as string,
      files: [] as string[],
    };
  },
  methods: {
    getPath(directory: string, filename: string): string {
      const fullPath = path.resolve(directory, filename);
      return fullPath;
    },
    getNumberFromFilename(filename: string): number {
      // chapterNumber_pageNumber.extension
      // first split -> ["chapterNumber", "pageNumber.extension"] so we take second ([1])
      // second split -> ["pageNumber", "extension"] so we take first ([0])
      const num = filename.split("_")[1].split(".")[0];
      return +num;
    },
    startReadingAtFile(file: string): void {
      console.log(file);
    },
    handleDirectory(directoryPath: string): void {
      this.directoryPath = directoryPath;
      fs.readdir(this.directoryPath, (err, files) => {
        if (err) console.log(err);
        files.sort((a, b) => {
          return this.getNumberFromFilename(a) - this.getNumberFromFilename(b);
        });
        this.files = files;
      });
    },
  },
});
</script>

<style scoped>
.reader {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.file {
  cursor: crosshair;
  display: flex;
  align-items: center;
}
</style>
