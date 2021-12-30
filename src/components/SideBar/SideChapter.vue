<template>
  <div class="chapter flex flex-col justify-around">
    <h2 class="text-center text-lg font-manga">{{ props.fullname }}</h2>
    <h3 v-if="props.volume" class="font-manga">{{ props.volume }}</h3>
    <h3 v-if="props.chapter" class="text-center">{{ props.chapter }}</h3>
    <span class="text-center">{{ props.current }} / {{ props.total }}</span>
    <LoadingBar :done="(props.current / props.total) * 100" :show="false" />
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
  }>();
</script>
