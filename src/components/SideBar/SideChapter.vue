<template>
  <div class="chapter flex flex-col justify-around">
    <h2>{{ props.name }}</h2>
    <span class="text-center">{{ props.current }} / {{ props.total }}</span>
    <LoadingBar :done="(props.current / props.total) * 100" :show="false" />
  </div>
</template>

<script lang="ts" setup>
import LoadingBar from "../LoadingBar.vue";
import { defineProps } from "@vue/runtime-core";

const props =
  defineProps<{
    name: string;
    current: number;
    total: number;
  }>();
</script>

<style scoped>
h2 {
  @apply text-center text-lg font-manga;
}

span {
  @apply text-center;
}
</style>