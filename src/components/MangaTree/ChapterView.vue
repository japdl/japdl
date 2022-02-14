<template>
  <div
    id="chapter"
    class="p-2 rounded-md bg-container hover:bg-light-background"
  >
    <p
      class="p-2"
      :class="{
        clicked: clicked,
      }"
      @click="clicked = !clicked"
  
    >
      {{ props.chapter.name }}
    </p>
    <div v-if="clicked" class="mt-2 ml-4 p-2 rounded-md">
      <label class="block">
        <input type="checkbox" v-model="options.cbr" />
        <span>Créer un fichier CBR</span>
      </label>
      <button class="basic">Télécharger</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import { reactive, ref } from "vue";
import { Chapter } from "../../../../japscandl/js/src/utils/types";
const props = defineProps<{
  chapter: Chapter;
}>();

const clicked = ref(false);

const options = reactive({
  cbr: false,
});
</script>

<style scoped>
/* this create an instant hover change and then slow fade */
#chapter:not(:hover) {
  @apply transition-all;
}

.clicked {
  @apply text-xl font-bold;
}
</style>
