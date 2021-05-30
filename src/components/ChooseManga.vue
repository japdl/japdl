<template>
  <form class="center">
    <label>Nom du manga: </label>
    <input type="text" v-model="mangaName" required />
    <button type="submit" @click="submitManga">Rechercher</button>
  </form>

  <Loading v-if="loading" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Loading from "@/components/Loading.vue";

export default defineComponent({
  name: "ChooseManga",
  components: { Loading },
  emits: ["manga"],
  data() {
    return {
      mangaName: "" as string,
      mangaNameValidated: false,
      mangaNameErrors: [] as string[],
      loading: false,
    };
  },
  methods: {
    submitManga(e: Event) {
      this.loading = true;
      e.preventDefault();
      this.loading = false;
      if (this.mangaName === "") {
        console.log("Nom vide");
      } else {
        console.log("Nom valide:", this.mangaName);
        this.$emit("manga", this.mangaName);
      }
    },
  },
});
</script>

<style scoped>
button {
  background-color: #42b983;
  border: none;
  color: white;
  padding: 7px;
  text-align: center;
  border-radius: 15px;
  margin-left: 10px;
}
</style>
