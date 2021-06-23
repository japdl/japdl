<template>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Staatliches&display=swap"
    rel="stylesheet"
  />
  <div class="chooser">
    <h1>{{ mangaName }}</h1>
    <div class="informations">
      <p>
        Dernier volume: {{ volumes }} <br />
        Dernier chapitre: {{ chapters }}
      </p>
    </div>
    <div @change="submitType">
      <div class="choice">
        <input type="radio" v-model="type" value="chapitre" />
        <label>Chapitres(s)</label>
      </div>
      <div class="choice">
        <input type="radio" v-model="type" value="volume" />
        <label>Volume(s)</label>
      </div>
    </div>
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
  margin-bottom: 10px;
}
</style>
