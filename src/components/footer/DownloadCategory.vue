<template>
  <div class="download" v-for="(download, index) in downloads" :key="download">
    Téléchargement de {{ download.name }}
    <button @click="removeDownload(download.name, index)" class="remove">
      Cacher
    </button>
    <LoadingBar :done="download.progress" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoadingBar from "@/components/LoadingBar.vue";

export default defineComponent({
  components: { LoadingBar },
  props: ["downloads"],
  emits: ["remove"],
  methods: {
    removeDownload(mangaName: string, index: number) {
      this.$emit("remove", index);
    },
  },
});
</script>

<style scoped>
.download {
  text-align: left;
}

button.remove {
  float: right;
}
</style>
