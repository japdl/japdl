<template>
  <div id="chapter">
    <p>{{ props.chapter.name }}</p>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import { Chapter } from "../../../../japscandl/js/src/utils/types";
const props = defineProps<{
  chapter: Chapter;
}>();
</script>
