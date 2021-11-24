<template>
  <div class="text-xl text-center">
    <h1 class="mb-4">
      Bienvenue sur japdl <b>{{ version }}</b
      >!
    </h1>
    <div v-if="loading">Chargement...</div>
    <div v-else>
      <div v-if="state.needUpdate" class="flex flex-col justify-center">
        <h2>
          La nouvelle version <b>{{ state.latestVersion }}</b> est disponible!
        </h2>
        <div id="infos">
          <p>
            La version <b>{{ state.latestVersion }}</b> est sortie le
            {{ state.releaseDate }}.
          </p>
          <p>Changement(s):</p>
          <div class="flex justify-center items-center">
            <div
              id="changelog"
              class="
                flex flex-col
                justify-center
                text-left
                w-2/3
                border-4
                p-4
                border-dark-primary
                rounded-xl
              "
            >
              <p
                id="line"
                v-for="line in state.changeLog.split('\r\n')"
                :key="line"
              >
                {{ line }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>Votre version est à jour!</div>
    </div>
    <div id="connectivity" class="flex flex-col justify-center">
      <h1 class="mt-4 mb-4">Status:</h1>
      <div>
        <CheckWebsiteState link="https://www.japscan.ws/" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CheckWebsiteState from "@/components/CheckWebsiteState.vue";
import { ipcRenderer } from "electron";
import { reactive, ref } from "vue";

import axios from "axios";

const loading = ref(true);
const upToDate = ref(true);

const state = reactive({
  needUpdate: false,
  releaseDate: "",
  changeLog: "",
  latestVersion: "",
});

const API_URL = "https://api.github.com/repos/Seysa/japdl-gui/releases";

type FetchResults = {
  couldFetch: boolean;
  releaseDate: string;
  changeLog: string;
  latestVersion: string;
};

const fetchLastRelease = async (): Promise<FetchResults> => {
  try {
    const response = await axios.get(API_URL);
    const latestRelease = response.data[0];
    const releaseDate = new Date(latestRelease.created_at).toLocaleDateString(
      "fr-FR",
      { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" }
    );
    const changeLog = latestRelease.body;
    console.log("changelog", changeLog);
    const latestVersion = latestRelease.tag_name.replace("v", "");
    upToDate.value = latestVersion === version.value;
    loading.value = false;
    return {
      couldFetch: true,
      changeLog,
      latestVersion,
      releaseDate,
    };
  } catch (e) {
    console.log(e);
    loading.value = false;
    return {
      couldFetch: false,
      changeLog: "",
      latestVersion: "",
      releaseDate: "",
    };
  }
};

const version = ref("0");
ipcRenderer.send("version");
ipcRenderer.on("versionResponse", async (event, arg) => {
  version.value = arg;
  const results: FetchResults = await fetchLastRelease();
  if (results.couldFetch) {
    if (results.latestVersion !== version.value) {
      state.needUpdate = true;
      state.changeLog = results.changeLog;
      state.latestVersion = results.latestVersion;
      state.releaseDate = results.releaseDate;
    }
  }
});
</script>
