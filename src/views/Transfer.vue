<template>
  <div class="flex flex-col justify-center items-center gap-4">
    <div id="explanatory" class="mx-4">
      <h1 class="text-2xl">Qu'est-ce que c'est ? Comment ça marche ?</h1>
      <h2 class="text-xl mb-2">
        Cet onglet sert à transférer les fichiers téléchargés de votre
        ordinateur sur un autre appareil, par exemple votre téléphone.
      </h2>
      <p>
        Vérifiez tout d'abord que votre ordinateur et l'autre appareil sont
        connectés sur le même réseau (wifi, ethernet)
      </p>
      <p>
        Activez le transfert en cliquant sur le bouton "Transfert désactivé"
      </p>
      <p>
        Ouvrez l'adresse indiquée dans le navigateur de votre appareil ou
        scannez le QR code
      </p>
      <p>
        Choisissez le manga ainsi que le fichier à télécharger en cliquant
        dessus
      </p>
      <p>
        Pour désactiver le transfert, cliquez sur le bouton "Transfert activé"
      </p>
    </div>

    <button
      @click="switchTransfer"
      class="p-2 mt-6 mb-3 rounded bg-opacity-70 text-center transition-colors text-white"
      :class="{
        'bg-red-500 hover:bg-red-700': !opened,
        'bg-green-500 hover:bg-green-700 ': opened,
      }"
    >
      Transfert {{ openedText }}
    </button>
    <div
      v-if="Object.keys(network).length === 0"
      class="flex flex-col items-center justify-center gap-2"
    >
      <h1>Aucun réseau n'a été détecté</h1>
    </div>
    <div v-else>
      <div v-for="(net, key) in network" :key="key" class="flex gap-1">
        <NetworkAddress :name="key" :address="net[0]" />
      </div>
    </div>
    <BaseButton @click="refreshNetwork">Actualiser</BaseButton>
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
const openedText = computed(() => (opened.value ? "activé" : "désactivé"));

function switchTransfer() {
  opened.value = ipcRenderer.sendSync("switchServer");
}

function refreshNetwork() {
  network.value = getNetwork();
}
</script>

<style scoped>
#explanatory > p::before {
  content: "- ";
}
</style>
