<template>
  <div id="chooseManga">
    <form @submit.prevent="submitManga">
      <label>Nom du manga: </label>
      <input type="search" v-model="mangaName" required />
      <button type="submit" class="basic">Rechercher</button>
      <p
        class="error"
        v-show="errors.length > 0"
        v-for="error in errors"
        :key="error"
      >
        {{ error }}
      </p>
    </form>
  </div>
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
    submitManga() {
      this.errors.length = 0;
      if (this.mangaName !== "") {
        const matched = this.mangaName.match(/[^a-zA-Z-]/);
        if (matched) {
          if (matched[0] === " ")
            this.errors.push("Le nom du manga ne peut pas contenir d'espaces");
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
#chooseManga {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
