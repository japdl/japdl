<template>
  <div class="chooser">
    <Container
      @change="submitType"
      class="chooseType"
      title="Type de téléchargement"
    >
      <div class="choice">
        <input type="radio" v-model="type" value="chapitre" />
        <label>Chapitres(s)</label>
      </div>
      <div class="choice">
        <input type="radio" v-model="type" value="volume" />
        <label>Volume(s)</label>
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

<style scoped>
.chooseType {
  margin-bottom: 20px;
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
