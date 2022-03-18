<template>
  <div v-if="loading">Chargement...</div>
  <div v-else>
    <div v-if="state.needUpdate" class="flex flex-col justify-center">
      <h2>
        La nouvelle version <b>{{ state.latestVersion }}</b> est disponible!
        <WebLink
          class="px-4 py-2 hover:background rounded-xl font-bold"
          :link="state.url"
          text="Cliquez ici pour la télécharger."
        />
      </h2>
      <div id="infos">
        <p>
          La version <b>{{ state.latestVersion }}</b> est sortie le
          {{ state.releaseDate }}.
        </p>
        <p class="mb-2">Changement(s):</p>
        <div class="flex justify-center items-center">
          <div
            id="changelog"
            class="flex flex-col justify-center text-left w-2/3 border-4 p-4 border-dark-primary rounded-xl gap-2"
          >
            <div
              v-for="version in versionsMissed"
              :key="version.tag_name"
              class="bg-container p-4 rounded-md whitespace-pre-line"
            >
              <h2 class="text-2xl mb-2">{{ version.tag_name }}</h2>
              <p>{{ version.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      Votre version <b>{{ version }}</b> est à jour!
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { reactive, ref } from "vue";
import { defineProps } from "@vue/runtime-core";
import WebLink from "../WebLink.vue";
import axios from "axios";

type Release = {
  tag_name: string;
  html_url: string;
  body: string;
  created_at: string;
};

const loading = ref(true);

const props = defineProps<{
  apiUrl: string;
}>();

const versionsMissed = ref<Release[]>([]);

const state = reactive({
  needUpdate: false,
  releaseDate: "",
  latestVersion: "",
  url: "",
});

async function getReleases() {
  return (await axios.get(props.apiUrl)).data;
}

async function getMissedReleases(currentVersion: string) {
  const releases: Release[] = await getReleases();
  const thisRelease = releases.find((release) => {
    if (release.tag_name === "v" + currentVersion) {
      return true;
    }
  });
  if (!thisRelease) return [];
  return releases.slice(0, releases.indexOf(thisRelease));
}

function toFrenchDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

const version = ref("0");
ipcRenderer.send("version");
ipcRenderer.on("versionResponse", async (event, arg) => {
  version.value = arg;
  loading.value = false;
  versionsMissed.value = await getMissedReleases(version.value);
  if (versionsMissed.value.length) {
    const latest = versionsMissed.value[0];
    state.needUpdate = true;
    state.latestVersion = latest.tag_name.replace("v", "");
    state.url = latest.html_url;
    state.releaseDate = toFrenchDate(versionsMissed.value[0].created_at);
  }
});
</script>
