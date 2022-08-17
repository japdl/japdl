<template>
  <div id="network" class="flex justify-center items-center gap-2 p-2">
    <div class="flex flex-col gap-1">
      <span class="px-2 py-1 rounded bg-container text-xl">{{
        props.name
      }}</span>
      <span
        class="px-2 py-1 rounded bg-container bg-white flex justify-center items-center"
        >{{ fullAddress }}</span
      >
      <button
        class="px-2 py-1 bg-dark-primary rounded hover:underline text-white"
        @click="copyToClipboard()"
      >
        Copier
      </button>
      <WebLink
        class="px-2 py-1 bg-dark-primary rounded text-white flex items-center justify-center"
        :link="webAddress"
        text="Voir"
      />
    </div>
    <Qrcode :data="webAddress" />
  </div>
</template>

<script lang="ts" setup>
import { PORT } from "@/utils/listeners/webserver";
import { clipboard } from "electron";
import WebLink from "@/components/WebLink.vue";
import Qrcode from "../Qrcode.vue";
import { computed, defineProps } from "@vue/runtime-core";
const props = defineProps<{
  name: string;
  address: string;
}>();

const fullAddress = computed(() => buildAddress(props.address));

const webAddress = computed(() => `http://${fullAddress}`);

function buildAddress(address: string) {
  return `${address}:${PORT}`;
}

function copyToClipboard() {
  clipboard.writeText(fullAddress.value);
}
</script>
