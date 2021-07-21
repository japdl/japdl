<template>
  <div id="options">
    <div id="summary" v-for="(option, name) in options" :key="option">
      <b>{{ name }}: </b>{{ option }}
    </div>
    <div id="theme">
      Thème:
      <div
        class="colorBox"
        id="dark"
        :class="{ selected: options.theme === 'dark' }"
        @click="selectTheme('dark')"
      >
        <span v-if="options.theme === 'dark'">sombre</span>
      </div>
      <div
        class="colorBox"
        id="light"
        :class="{ selected: options.theme === 'light' }"
        @click="selectTheme('light')"
      >
        <span v-if="options.theme === 'light'">lumineux</span>
      </div>
    </div>

    <div id="imageFormat">
      <label for="imageSelect"> Format des images: </label>
      <select id="imageSelect" v-model="options.imageFormat">
        <option v-for="format in possibleOptions.imageFormat" :key="format">
          {{ format }}
        </option>
      </select>
    </div>
    <div id="save">
      <button @click="setData">Sauvegarder les modifications</button>
    </div>
    <div id="saveMessage"></div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { defineComponent } from "vue";
import { configData } from "@/utils/handleConfig";

export default defineComponent({
  data() {
    return {
      options: {} as configData,
      possibleOptions: {} as { [key: string]: string[] },
      message: "" as string,
    };
  },
  mounted() {
    console.log("Options mounted");
    ipcRenderer.send("getConfigData");
    ipcRenderer.once("returnConfigData", (event, data: configData) => {
      this.options = data;
      console.log("Data received", data);
    });
    ipcRenderer.send("getPossibleOptions");
    ipcRenderer.once("returnPossibleOptions", (event, data) => {
      this.possibleOptions = data;
      console.log("Possible options received", data);
    });
  },
  methods: {
    selectTheme(theme: string) {
      if (!this.possibleOptions.theme.includes(theme)) return;
      this.options.theme = theme as "dark" | "light";
    },
    setData() {
      console.log("Sending set data", this.options);
      ipcRenderer.send("setData", {
        theme: this.options.theme,
        outputDirectory: this.options.outputDirectory,
        imageFormat: this.options.imageFormat,
        chromePath: this.options.chromePath,
      } as configData);
      ipcRenderer.on("dataSet", (event, data) => {
        if (data === "ok") {
          this.message = "Les options ont été enregistrées avec succès";
        } else {
          const objectEntries = Object.entries(data);
          const errorMessage = objectEntries
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
          this.message = `Erreur lors de l'enregistrement des options: ${errorMessage}`;
        }
      });
    },
  },
});
</script>

<style scoped>
#options {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#options div {
  margin-top: 10px;
  margin-bottom: 10px;
}
#theme {
  display: flex;
  justify-content: center;
  align-items: center;
}
.colorBox {
  transition: width ease 1s;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
#dark {
  background-color: black;
  color: white;
}

#light {
  background-color: white;
  color: black;
}
.colorBox.selected {
  width: 80px;
  outline: 3px solid var(--primary);
  outline-offset: -3px;
}
</style>
