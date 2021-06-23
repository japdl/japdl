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
  emits: ["selected"],
  methods: {
    queryDirectory(): string {
      return ipcRenderer.sendSync("directory-question", false)[0];
    },
    queryDirectories(): string[] {
      return ipcRenderer.sendSync("directory-question", true);
    },
    handleDirectory() {
      let result = ipcRenderer.sendSync("directory-question", this.multiple);
      if (result) this.$emit("selected", result);
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
