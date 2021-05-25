<template>
  <h1>{{ mangaName }}</h1>
  <div class="informations">
    <h2>tatata volumes</h2>
    <h3>tatata chapitres</h3>
  </div>
  <select class="chooseType" v-model="type" @change="submitType">
    <option value="" disabled selected>Selectionner</option>
    <option value="chapitre">Chapitre(s)</option>
    <option value="volume">Volume(s)</option>
  </select>
  <div v-if="type">
    <span>
      {{ type }}(s)
      <input type="number" v-model="start" />
      à
      <input type="number" v-model="end" />
    </span>
    <br />
    <!-- Grisés temps que start n'a pas de valeur -->
    <button>Télécharger</button>
    <button>Télécharger en cbr</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: ["mangaName"],
  name: "ChooseDownloadType",
  emits: ["type"],
  data() {
    return {
      type: "",
      start: "",
      end: "",
    };
  },
  methods: {
    submitType() {
      this.$emit("type", this.type);
    },
  },
});
</script>

<style scoped>
.chooseType {
  margin-bottom: 20px;
}
</style>
