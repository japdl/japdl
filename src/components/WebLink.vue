<template>
  <span
    class="hover:underline cursor-pointer"
    @click="shell.openExternal(props.link)"
    >{{ whatToShow }}</span
  >
</template>

<script lang="ts" setup>
import { shell } from "electron";
import { defineProps, computed } from "@vue/runtime-core";
const props = defineProps<{
  link: string;
  text?: string;
}>();

const whatToShow = computed(() => {
  const { link, text } = props;
  return text ? text : link;
});
</script>
