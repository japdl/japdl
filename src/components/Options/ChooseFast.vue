<template>
  <ChooseBetweenTwo
    first="désactivé"
    second="activé"
    header="Mode rapide"
    :selected="props.fast ? Choice.Second : Choice.First"
    @choice="handleChoice"
  />
</template>

<script lang="ts" setup>
import ChooseBetweenTwo, { Choice } from "../ChooseBetweenTwo.vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  fast: boolean;
}>();

const emit = defineEmits<{
  (event: "update:fast", imageFormat: boolean): void;
}>();

function handleChoice(selection: Choice) {
  if (selection === Choice.None) return;
  if (selection === Choice.First) {
    emit("update:fast", false);
  } else {
    emit("update:fast", true);
  }
}
</script>
