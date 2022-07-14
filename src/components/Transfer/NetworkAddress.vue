<template>
  <span class="px-2 py-1 rounded bg-dark-primary">{{ props.name }}</span>
  <span class="px-2 py-1 rounded bg-dark-background bg-white">{{
    buildAddress(props.address)
  }}</span>
  <button
    class="px-2 py-1 bg-dark-primary rounded"
    @click="copyToClipboard(props.address)"
  >
    Copier
  </button>
  <WebLink
    class="px-2 py-1 bg-dark-primary rounded"
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
