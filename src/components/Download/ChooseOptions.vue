<template>
  <Container
    class="flex justify-center items-center flex-col"
    header="Options de téléchargement"
  >
    <div id="download-options" class="flex flex-col">
      <div>
        <label class="block">
          <input type="radio" v-model="state.asOne" value="" />
          Créer un fichier par chapitre</label
        >
        <label class="block">
          <input type="radio" v-model="state.asOne" value="asOne" />
          Créer un seul fichier regroupant tous les chapitres</label
        >
      </div>

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
    *format CBZ: Toutes les images sont contenues dans un fichier unique.</span
  >
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";
import { defineProps, defineEmits } from "@vue/runtime-core";

import Container from "../Container.vue";
import { DownloadOptions } from "@/utils/types";

/* we are not using props in the code, we only use them for the
 * v-model.
 */
defineProps<{
  range: boolean;
  options: DownloadOptions;
}>();

const zipOptions = [
  {
    label: "Créer un fichier CBZ*",
    value: "cbz",
  },
  {
    label: "Ne pas créer de fichier CBZ*",
    value: "",
  },
];

const emit = defineEmits<{
  (event: "update:options", param: DownloadOptions): void;
}>();

const state = reactive({
  compression: "cbz" as "cbz" | "",
  images: false,
  asOne: "" as "asOne" | "",
});

onMounted(() => {
  emit("update:options", {
    compression: state.compression,
    images: state.images,
    asOne: state.asOne === "asOne",
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
