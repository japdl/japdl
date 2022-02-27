<template>
  <ChooseBetweenTwo
    first="chapitre"
    second="volume"
    header="Type de téléchargement"
    @choice="handleEmit"
  />
</template>

<script lang="ts" setup>
import { defineEmits } from "@vue/runtime-core";
import ChooseBetweenTwo from "../ChooseBetweenTwo.vue";

const emit = defineEmits<{
  (event: "type", type: string): void;
}>();

const handleEmit = (_type: -1 | 0 | 1) => {
  if(_type === -1) return;
  if (_type === 0) {
    emit("type", "chapitre");
  } else {
    emit("type", "volume");
  }
};
</script>
