<template>
  <div class="chooseFolder">
    <button ref="choose" @click="handleDirectory">{{ buttonTextValue }}</button>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { defineEmits, defineProps } from "@vue/runtime-core";
import { computed } from "vue";

const emit = defineEmits<{
  (event: "selected", folders: string[]): void;
}>();

const buttonTextValue = computed(() =>
  props.buttonText
    ? props.buttonText
    : props.multiple
    ? "Sélectionner le(s) dossier(s)"
    : "Sélectionner le dossier"
);

const props = defineProps<{
  multiple: boolean;
  buttonText: string;
}>();

function handleDirectory() {
  let result = ipcRenderer.sendSync("directory-question", props.multiple);
  if (result) emit("selected", result);
}
</script>
