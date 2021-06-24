<template>
  <div id="downloadBar">
    <h4 v-if="Object.entries(currentDownloads).length === 0">
      Aucun téléchargement en cours
    </h4>
    <DownloadCategories
      v-else
      :currentDownloads="currentDownloads"
      @remove="removeDownload"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ipcRenderer } from "electron";
import { MangaAttributes } from "japscandl/js/src/utils/types";
import DownloadCategories from "@/components/footer/DownloadCategories.vue";
export default defineComponent({
  components: {
    DownloadCategories,
  },
  data() {
    return {
      currentDownloads: {} as Record<
        string,
        { name: string; progress: number }[]
      >,
    };
  },
  methods: {
    removeDownload(toRemove: { name: string; index: number }) {
      const { name, index } = toRemove;
      console.log("Recoit dans footer: ", toRemove);
      this.currentDownloads[name].splice(index, 1);
      if (this.currentDownloads[name].length === 0) {
        delete this.currentDownloads[name];
      }
    },
  },
  mounted() {
    ipcRenderer.on(
      "downloadUpdatePage",
      (
        event,
        data: { attributes: MangaAttributes; total: number; progress: number }
      ) => {
        const { attributes, progress } = data;
        const downloadInfos = {
          name: attributes.manga + " " + attributes.chapter,
          progress: progress,
        };
        if (!(attributes.manga in this.currentDownloads)) {
          this.currentDownloads[attributes.manga] = [downloadInfos];
        } else {
          // checking if name is already in downloads
          const index = this.currentDownloads[attributes.manga].findIndex(
            (obj) => obj?.name === downloadInfos.name
          );
          // if is not in downloads, add it
          if (index === -1) {
            this.currentDownloads[attributes.manga].push(downloadInfos);
          } /* if it is, update progress */ else {
            this.currentDownloads[attributes.manga][index].progress =
              downloadInfos.progress;
          }
        }
      }
    );
  },
});
</script>

<style scoped>
#downloadBar {
  overflow: auto;
  width: 100%;
  border: var(--dark-background) solid 2px;
  position: fixed;
  bottom: 0;
  text-align: center;
}

summary {
  font-weight: bold;
  height: 30px;
  margin: auto;
  padding: 10px;
}
</style>
