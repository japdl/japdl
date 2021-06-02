<template>
  <div class="chooseFolder">
    <button ref="choose" @click="handleDirectory"></button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ipcRenderer } from "electron";

export default defineComponent({
  props: ["multiple", "buttonText"],
  name: "chooseFolder",
  emits: ["folders"],
  methods: {
    queryDirectory(): string {
      return ipcRenderer.sendSync("directory-question", false)[0];
    },
    queryDirectories(): string[] {
      return ipcRenderer.sendSync("directory-question", true);
    },
    handleDirectory() {
      if (this.multiple) {
        this.$emit("folders", this.queryDirectories());
      } else {
        this.$emit("folders", this.queryDirectory());
      }
    },
  },
  mounted() {
    console.log(this.$refs);
    if (this.$refs.choose) {
      const chooseButton = this.$refs.choose as HTMLButtonElement;
      chooseButton.textContent = this.buttonText
        ? this.buttonText
        : this.multiple
        ? "Sélectionner le(s) dossier(s)"
        : "Sélectionner le dossier";
    }
  },
});
</script>

<style></style>
