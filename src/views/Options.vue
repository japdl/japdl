<template>
  <div id="options">
    <div id="summary" v-for="(option, name) in state.options" :key="option">
      <b>{{ name }}: </b>{{ option }}
    </div>
    <div id="theme">
      Thème:
      <div
        v-for="theme in state.themes"
        :key="theme.theme"
        class="colorBox"
        :id="theme.theme"
        :class="{ selected: state.options.theme === theme.theme }"
        @click="selectTheme(theme.theme)"
      >
        <span v-if="state.options.theme === theme.theme">{{ theme.text }}</span>
      </div>
    </div>

    <div id="imageFormat">
      <label for="imageSelect"> Format des images: </label>
      <select id="imageSelect" v-model="state.options.imageFormat">
        <option
          v-for="format in state.possibleOptions.imageFormat"
          :key="format"
        >
          {{ format }}
        </option>
      </select>
    </div>
    <div id="chromePath">
      Chemin de chrome:
      <input
        type="text"
        v-model="state.options.chromePath"
        :placeholder="
          state.options.chromePath === '' ? 'Veuillez entrer un chemin' : ''
        "
      /><button @click="chooseChromePath">Choisir un fichier</button>
      <button @click="checkPath(state.options.chromePath)">
        Vérifier le chemin
      </button>
      <div class="message">{{ state.pathMessage }}</div>
      <div class="error">{{ state.pathError }}</div>
    </div>
    <div>
      Dossier de téléchargement:
      <input type="text" v-model="state.options.outputDirectory" />
      <button @click="chooseOutPath">Choisir un dossier</button>
      <button @click="defaultOutPath">Par défaut</button>
    </div>
    <div id="save">
      <button @click="setData">Sauvegarder les modifications</button>
    </div>
    <div id="message" v-if="state.message">{{ state.message }}</div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { defineComponent, onMounted, reactive } from "vue";
import { configData } from "@/utils/handleConfig";
import fs from "fs";

export default defineComponent({
  setup() {
    const state = reactive({
      themes: [
        {
          theme: "dark",
          text: "sombre",
        },
        {
          theme: "light",
          text: "lumineux",
        },
      ],
      options: {} as configData,
      possibleOptions: {} as { [key: string]: string[] },
      message: "" as string,
      pathMessage: "" as string,
      pathError: "" as string,
      //@ts-expect-error doesn't understand Timeout type
      // eslint-disable-next-line no-undef
      timeout: null as null | Timeout,
      //@ts-expect-error doesn't understand Timeout type
      // eslint-disable-next-line no-undef
      pathTimeout: null as null | Timeout,
    });

    onMounted(() => {
      console.log("Options mounted");
      ipcRenderer.send("getConfigData");
      ipcRenderer.once("returnConfigData", (event, data: configData) => {
        state.options = data;
        console.log("Data received", data);
      });
      ipcRenderer.send("getPossibleOptions");
      ipcRenderer.once("returnPossibleOptions", (event, data) => {
        state.possibleOptions = data;
        console.log("Possible options received", data);
      });
    });

    const methods = {
      selectTheme(theme: string) {
        if (!state.possibleOptions.theme.includes(theme)) return;
        state.options.theme = theme as "dark" | "light";
      },
      setData() {
        console.log("Sending set data", state.options);
        const data = ipcRenderer.sendSync("setDataSync", {
          theme: state.options.theme,
          outputDirectory: state.options.outputDirectory,
          imageFormat: state.options.imageFormat,
          chromePath: state.options.chromePath,
        } as configData);
        if (state.timeout) clearTimeout(state.timeout);
        if (data === "ok") {
          state.message = "Les options ont été enregistrées avec succès";
        } else {
          const objectEntries = Object.entries(data);
          const errorMessage = objectEntries
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
          state.message = `Erreur lors de l'enregistrement des options: ${errorMessage}`;
        }
        state.timeout = setTimeout(() => {
          state.message = "";
          state.timeout = null;
        }, 2000);
      },
      chooseChromePath() {
        const [newPath] = ipcRenderer.sendSync("file-question");
        console.log(newPath);
        if (newPath) {
          state.options.chromePath = newPath;
          // verif path
          this.checkPath(newPath);
        }
      },
      chooseOutPath() {
        const [newPath] = ipcRenderer.sendSync("directory-question");
        console.log(newPath);
        if (newPath) state.options.outputDirectory = newPath;
      },
      checkPath(path: string) {
        if (fs.existsSync(path)) {
          const data = ipcRenderer.sendSync("checkChromePath", path);
          if (data.good) {
            state.pathMessage = "Le chemin est bon";
          } else {
            state.pathMessage = "Le fichier n'est pas chrome";
            state.pathError = data.msg;
          }
        } else {
          state.pathError = "Le chemin n'existe pas";
          state.pathTimeout = setTimeout(() => {
            state.pathMessage = "";
            state.pathError = "";
            state.pathTimeout = null;
          }, 2000);
        }
      },
      defaultOutPath() {
        const data = ipcRenderer.sendSync("getDefaultDataSync");
        state.options.outputDirectory = data.outputDirectory;
      },
    };
    return {
      state,
      ...methods,
    };
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
