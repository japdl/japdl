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
      <div v-for="(net, key) in network" :key="net" class="flex gap-1">
        <NetworkAddress :name="key" :address="net[0]" />
      </div>
    </div>
    <BaseButton @click="refreshNetwork">Rafraichir</BaseButton>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "@vue/reactivity";
import BaseButton from "@/components/BaseButton.vue";
import NetworkAddress from "@/components/Transfer/NetworkAddress.vue";
import { getNetwork } from "@/utils/network";
import { ipcRenderer } from "electron";

const network = ref(getNetwork());

const opened = ref(ipcRenderer.sendSync("serverStatus"));
const openedText = computed(() => (opened.value ? "En cours" : "Interrompu"));

function switchTransfer() {
  opened.value = ipcRenderer.sendSync("switchServer");
}

function refreshNetwork() {
  network.value = getNetwork();
}
</script>
