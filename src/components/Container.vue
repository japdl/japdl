<template>
  <div class="px-6 py-8 rounded-2xl shadow-xl bg-container">
    <h1 v-if="props.header" class="text-2xl mb-6 font-bold">
      {{ props.header }}
    </h1>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";

const props = defineProps<{
  header?: string;
}>();
</script>