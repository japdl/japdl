<template>
  <Container
    class="flex justify-center items-center flex-col"
    header="Options de téléchargement"
  >
    <div id="download-options" class="flex flex-col">
      <label class="block">
        <input type="checkbox" v-model="state.images" value="images" />
        Conserver les images dans un dossier</label
      >

      <label v-for="zipOption in zipOptions" :key="zipOption.value">
        <input
          type="radio"
          v-model="state.compression"
          :value="zipOption.value"
        />
        {{ zipOption.label }}</label
      >
    </div>
  </Container>
  <span v-scroll-to class="text-gray-400 hover:text-current">
    *format CBR: Toutes les images sont contenues dans un fichier unique.</span
  >
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";
import { defineProps, defineEmits } from "@vue/runtime-core";

import Container from "../Container.vue";

/* we are not using props in the code, we only use them for the
 * v-model.
 */
defineProps<{
  options: { compression: "cbr" | ""; images: boolean };
}>();

const zipOptions = [
  {
    label: "Créer un fichier CBR*",
    value: "cbr",
  },
  {
    label: "Ne pas créer de fichier CBR*",
    value: "",
  },
];

const emit = defineEmits<{
  (
    event: "update:options",
    param: { compression: "cbr" | ""; images: boolean }
  ): void;
}>();

const state = reactive({
  compression: "" as "cbr" | "",
  images: false,
});

onMounted(() => {
  emit("update:options", {
    compression: state.compression,
    images: state.images,
  });
});

watch(
  () => state.compression,
  (newCompression) => {
    emit("update:options", {
      compression: newCompression,
      images: state.images,
    });
  }
);

watch(
  () => state.images,
  (newImage) => {
    emit("update:options", {
      compression: state.compression,
      images: newImage,
    });
  }
);
</script>
