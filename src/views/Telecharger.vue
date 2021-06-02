<template>
  <div class="telecharger">
    <img class="icon" src="../assets/noun_torii.svg" />
    <ChooseManga @manga="getMangaInfos" />
    <ChooseDownloadType
      v-if="mangaName"
      :mangaName="mangaName"
      @type="getType"
      :volumes="mangaVolumes"
      :chapters="mangaChapters"
    />
    <ChooseRangeAndDownload />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChooseManga from "@/components/ChooseManga.vue";
import ChooseDownloadType from "@/components/ChooseDownloadType.vue";
import ChooseRangeAndDownload from "@/components/ChooseRangeAndDownload.vue";

export default defineComponent({
  name: "Telecharger",
  components: { ChooseManga, ChooseDownloadType, ChooseRangeAndDownload },
  data() {
    return {
      mangaName: "" as string,
      mangaVolumes: null as null | number,
      mangaChapters: null as null | number,
      mangaType: "" as string,
    };
  },
  methods: {
    getMangaInfos(name: string) {
      console.log("Nom du manga: ", name);
      this.mangaName = name;
    },
    getType(type: string) {
      this.mangaType = type;
      console.log("type: ", type);
    },
  },
});
</script>

<style scoped>
.telecharger {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
