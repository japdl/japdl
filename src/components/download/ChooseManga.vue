<template>
  <form class="center" @submit="submitManga">
    <label>Nom du manga: </label>
    <input type="search" v-model="mangaName" required />
    <button type="submit">Rechercher</button>
    <p
      class="error"
      v-show="errors.length > 0"
      v-for="error in errors"
      :key="error"
    >
      {{ error }}
    </p>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChooseManga",
  emits: ["manga"],
  data() {
    return {
      mangaName: "" as string,
      mangaNameValidated: false,
      mangaNameErrors: [] as string[],
      errors: [] as string[],
    };
  },
  methods: {
    submitManga(e: Event) {
      this.errors.length = 0;
      e.preventDefault();
      if (this.mangaName !== "") {
        const matched = this.mangaName.match(/[^a-zA-Z-]/);
        if (matched) {
          if (matched[0] === " ")
            this.errors.push("Le nom du manga ne peut pas contenir d'espaces.");
          else
            this.errors.push(
              "Le nom du manga ne peut pas contenir de caractères spéciaux"
            );
        } else {
          this.$emit("manga", this.mangaName);
        }
      }
    },
  },
});
</script>

<style scoped>
button {
  background-color: #880921;
  border: none;
  color: white;
  padding: 7px;
  text-align: center;
  border-radius: 15px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
