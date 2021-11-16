<template>
  <div class="flex flex-col items-start">
    <Container
      @change="submitType"
      class="mb-5 w-full p-3 flex items-center flex-col"
      header="Type de téléchargement"
    >
      <div class="choice">
        <label>
          <input type="radio" v-model="type" value="chapitre" />
          Chapitres(s)</label
        >
      </div>
      <div class="choice">
        <label>
          <input type="radio" v-model="type" value="volume" />
          Volume(s)</label
        >
      </div>
    </Container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Container from "../Container.vue";
Container;
export default defineComponent({
  components: { Container },
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
