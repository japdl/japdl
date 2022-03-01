<template>
  <ChooseBetweenTwo
    header="Format des fichiers d'images"
    first="png"
    second="jpg"
    :selected="imageFormatToChoice"
    @choice="handleImageFormat"
  />
</template>

<script lang="ts" setup>
import ChooseBetweenTwo, { Choice } from "../ChooseBetweenTwo.vue";
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps<{
  format: "png" | "jpg";
}>();

const emit = defineEmits<{
  (event: "update:format", imageFormat: "png" | "jpg"): void;
}>();

function handleImageFormat(selection: Choice) {
  if (selection === Choice.None) return;
  if (selection === Choice.First) {
    emit("update:format", "png");
  } else {
    emit("update:format", "jpg");
  }
}

const imageFormatToChoice = computed(() => {
  if (props.format === "png") {
    return Choice.First;
  } else if (props.format === "jpg") {
    return Choice.Second;
  } else {
    return Choice.None;
  }
});
</script>
