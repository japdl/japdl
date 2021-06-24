<template>
  <form @submit="downloadSelected">
    <input
      class="inputText"
      type="number"
      v-model="start"
      min="0"
      :max="max"
      :placeholder="'Numéro du ' + type"
      required
    />
    à
    <input
      class="inputText"
      type="number"
      v-model="end"
      :min="start"
      :max="max"
      placeholder="Ce champ n'est pas obligatoire"
    />
    <div class="downloadOptions">
      <p>options de téléchargement:</p>
      <div class="downloadOption">
        <input type="checkbox" v-model="options" value="cbr" />
        <label>Créer un fichier CBR</label>
      </div>

      <div class="downloadOption">
        <input type="checkbox" v-model="options" value="images" />
        <label>Télécharger les images en .jpg</label>
      </div>
    </div>
    <div class="downloadButtons">
      <!-- Grisés temps que start n'a pas de valeur -->
      <button type="submit" class="basic" :disabled="options.length <= 0">
        Télécharger
      </button>
    </div>
    <p class="error" v-if="options.length <= 0">Une option doit être cochée</p>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["type", "max"],
  name: "ChooseRangeAndDownload",
  emits: ["download"],
  data() {
    return {
      start: "" as string,
      end: "" as string,
      options: [] as string[],
      error: "" as string,
    };
  },
  methods: {
    downloadSelected(event: Event & { submitter: HTMLButtonElement }) {
      event.preventDefault();
      if (!this.options.length) {
        this.error = "Aucune option n'a été cochée";
        return;
      }
      this.$emit("download", {
        options: this.options,
        start: this.start,
        end: this.end,
      });
    },
  },
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

div.downloadOptions {
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

input.inputText {
  width: 200px;
}
</style>
