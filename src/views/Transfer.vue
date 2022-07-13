<template>
  <div class="flex flex-col justify-center items-center gap-2">
    <h1
      class="p-2 rounded bg-opacity-70 text-center"
      :class="{
        'bg-red-500': !opened,
        'bg-green-500': opened,
      }"
    >
      Status: {{ openedText }}
    </h1>
    <BaseButton @click="switchTransfer">
      Ouvrir le transfert au réseau
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "@vue/reactivity";
import BaseButton from "@/components/BaseButton.vue";
import { ipcRenderer } from "electron";

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
</script>
