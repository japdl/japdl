<template>
  <div class="flex flex-col justify-center items-center gap-2">
    <button
      @click="switchTransfer"
      class="p-2 rounded bg-opacity-70 text-center transition-colors"
      :class="{
        'bg-red-500 hover:bg-red-700': !opened,
        'bg-green-500 hover:bg-green-700 ': opened,
      }"
    >
      Status: {{ openedText }}
    </button>
    <div
      v-if="Object.keys(network).length === 0"
      class="flex flex-col items-center justify-center gap-2"
    >
      <h1>Aucun réseau n'a été détecté</h1>
    </div>
    <div v-else>
      <div v-for="(net, key) in network" :key="net">
        <span class="px-2 py-1 rounded bg-dark-primary">{{ key }}</span>
        <span class="px-2 py-1 rounded bg-dark-background bg-white">{{
          buildAddress(net[0])
        }}</span>
        <button
          class="px-2 py-1 bg-dark-primary rounded"
          @click="copyToClipboard(net[0])"
        >
          Copier
        </button>
      </div>
    </div>
    <BaseButton @click="refreshNetwork">Rafraichir</BaseButton>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "@vue/reactivity";
import BaseButton from "@/components/BaseButton.vue";
import { getNetwork } from "@/utils/network";
import { ipcRenderer, clipboard } from "electron";
import { PORT } from "@/utils/listeners/webserver";

const network = ref(getNetwork());

const opened = ref(false);
const openedText = computed(() => (opened.value ? "opened" : "closed"));

function switchTransfer() {
  if (opened.value) {
    opened.value = false;
  } else {
    opened.value = true;
  }
  ipcRenderer.send("switchServer");
}

function buildAddress(address: string) {
  return `${address}:${PORT}`;
}

function copyToClipboard(address: string) {
  clipboard.writeText(buildAddress(address));
}

function refreshNetwork() {
  network.value = getNetwork();
}
</script>
