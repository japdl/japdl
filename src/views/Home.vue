<template>
  <img class="icon" src="../assets/noun_torii.png" />
  <ChooseManga @manga="getMangaName" />
  <ChooseDownloadType v-if="mangaName" :mangaName="mangaName" @type="getType" />
  <ChooseRangeAndDownload />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChooseManga from "@/components/ChooseManga.vue";
import ChooseDownloadType from "@/components/ChooseDownloadType.vue";
import ChooseRangeAndDownload from "@/components/ChooseRangeAndDownload.vue";

export default defineComponent({
  name: "Home",
  components: { ChooseManga, ChooseDownloadType, ChooseRangeAndDownload },
  data() {
    return {
      mangaName: "" as string,
      mangaType: "" as string,
    };
  },
  methods: {
    getMangaName(name: string) {
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
.icon {
  width: 40px;
}
</style>
