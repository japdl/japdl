<template>
  <div class="chapter flex flex-col justify-around overflow-auto">
    <h2 class="text-center text-xl font-manga underline">
      {{ props.fullname }}
    </h2>
    <h3 v-if="props.volume" class="text-xl font-manga">{{ props.volume }}</h3>
    <h3 v-if="props.chapter">{{ props.chapter }}</h3>
    <span class="text-center">{{ props.current }} / {{ props.total }}</span>
    <LoadingBar :done="props.percent" :show="false" />
  </div>
</template>

<script lang="ts" setup>
import LoadingBar from "../LoadingBar.vue";
import { defineProps } from "@vue/runtime-core";

const props =
  defineProps<{
    fullname: string;
    volume?: string;
    chapter?: string;
    current: number;
    total: number;
    percent: number;
  }>();
</script>

<style scoped>
h3 {
  @apply block text-center;
}
</style>
