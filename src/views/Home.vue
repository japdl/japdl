<template>
  <div class="text-xl text-center">
    <h1 class="mb-4">Bienvenue sur japdl!</h1>
    <VersionCheck :api-url="API_URL" />
    <div id="connectivity" class="flex flex-col justify-center items-center">
      <h1 class="mt-4 mb-4">Accessibilité:</h1>
      <div class="flex gap-2 flex-col">
        <CheckWebsiteState :link="japscanUrl" />
        <CheckWebsiteState :link="API_URL" title="Github" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CheckWebsiteState from "@/components/CheckWebsiteState.vue";
import VersionCheck from "@/components/Home/VersionCheck.vue";
import { ipcRenderer } from "electron";
const API_URL = "https://api.github.com/repos/japdl/japdl/releases";
const japscanUrl = ipcRenderer.sendSync("website");
</script>
