<template>
  <div class="telecharger">
    <img class="icon" src="../assets/noun_torii.svg" />
    <div class="choose">
      <ChooseManga @manga="getMangaInfos" />
    </div>
    <ChooseDownloadType
      v-if="mangaName"
      :mangaName="mangaName"
      @type="getType"
      :volumes="mangaVolumes"
      :chapters="mangaChapters"
    />
    <ChooseRangeAndDownload
      @download="sendDownloadToBackground"
      v-if="mangaType"
      :type="mangaType"
      :max="selectMax"
    />
  </div>
  <Loading v-if="loading" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChooseManga from "@/components/download/ChooseManga.vue";
import ChooseDownloadType from "@/components/download/ChooseDownloadType.vue";
import ChooseRangeAndDownload from "@/components/download/ChooseRangeAndDownload.vue";
import { ipcRenderer } from "electron";
import Loading from "@/components/Loading.vue";
export default defineComponent({
  name: "Telecharger",
  components: {
    ChooseManga,
    ChooseDownloadType,
    ChooseRangeAndDownload,
    Loading,
  },
  data() {
    return {
      mangaName: "" as string,
      mangaVolumes: null as null | number,
      mangaChapters: null as null | number,
      mangaType: "" as string,
      loading: false as boolean,
    };
  },
  computed: {
    selectMax(): number {
      return this.mangaType === "volume"
        ? (this.mangaVolumes as number)
        : (this.mangaChapters as number);
    },
  },
  methods: {
    getMangaInfos(name: string) {
      console.log("Nom du manga: ", name);
      this.loading = true;
      ipcRenderer.send("getMangaInfos", name);
      ipcRenderer.once("replyMangaInfos", (event, infos) => {
        this.loading = false;
        this.mangaVolumes = infos.volumes;
        this.mangaChapters = infos.chapters;
        this.mangaName = infos.name;
      });
    },
    getType(type: string) {
      this.mangaType = type;
      console.log("type: ", type);
    },
    sendDownloadToBackground(options: {
      options: ("cbr" | "images")[];
      start: number;
      end: number;
    }) {
      const emitOptions = {
        start: options.start,
        end: options.end,
        type: this.mangaType,
        manga: this.mangaName,
        compression: options.options.includes("cbr"),
        deleteAfter: !options.options.includes("images"),
      };
      console.log(emitOptions);
      ipcRenderer.send("download", emitOptions);
    },
  },
});
</script>

<style scoped>
.telecharger {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10%;
  margin-bottom: 5%;
}

.choose {
  align-self: flex-start;
}
</style>
