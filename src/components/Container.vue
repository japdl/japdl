<template>
  <div
    class="
      flex
      justify-center
      items-center
      flex-col
      px-6
      py-8
      rounded-2xl
      shadow-xl
    "
  >
    <h1 v-if="props.title" class="text-2xl mb-6 font-bold">
      {{ props.title }}
    </h1>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
});
</script>

<style scoped>
div {
  background-color: var(--container);
}
</style>
