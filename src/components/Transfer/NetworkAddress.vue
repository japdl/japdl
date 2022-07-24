<template>
  <span class="px-2 py-1 rounded bg-container text-xl">{{ props.name }}</span>
  <span
    class="px-2 py-1 rounded bg-container bg-white flex justify-center items-center"
    >{{ buildAddress(props.address) }}</span
  >
  <button
    class="px-2 py-1 bg-dark-primary rounded hover:underline text-white"
    @click="copyToClipboard(props.address)"
  >
    Copier
  </button>
  <WebLink
    class="px-2 py-1 bg-dark-primary rounded text-white flex items-center"
    :link="`http://${buildAddress(props.address)}`"
    text="Voir"
  />
</template>

<script lang="ts" setup>
import { PORT } from "@/utils/listeners/webserver";
import { clipboard } from "electron";
import WebLink from "@/components/WebLink.vue";
import { defineProps } from "@vue/runtime-core";
const props = defineProps<{
  name: string;
  address: string;
}>();

function buildAddress(address: string) {
  return `${address}:${PORT}`;
}

function copyToClipboard(address: string) {
  clipboard.writeText(buildAddress(address));
}
</script>
