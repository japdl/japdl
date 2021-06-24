<template>
  <div class="chooser">
    <h1>{{ mangaName }}</h1>
    <div class="informations">
      <p>
        Dernier volume: {{ volumes }} <br />
        Dernier chapitre: {{ chapters }}
      </p>
    </div>
    <fieldset @change="submitType" class="chooseType">
      <legend>Type de téléchargement</legend>
      <div class="choice">
        <input type="radio" v-model="type" value="chapitre" />
        <label>Chapitres(s)</label>
      </div>
      <div class="choice">
        <input type="radio" v-model="type" value="volume" />
        <label>Volume(s)</label>
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: ["mangaName", "volumes", "chapters"],
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

h1 {
  font-family: "Staatliches", cursive;
}

.chooser {
  display: flex;
  flex-direction: column;
  align-items: left;
}

.choice {
  margin-bottom: 5px;
}
</style>
