<template>
  <div
    class="border-2 p-3 rounded-xl flex flex-col"
    :class="{ reached: reachable, notreached: !reachable, loading: loading }"
  >
    <WebLink v-if="!title" :link="props.link"></WebLink>
    <h1 v-else>{{ title }}</h1>
    <span v-if="loading">Chargement...</span>
    <span v-else-if="reachable">Accessible en {{ timeElapsed }}s</span>
    <span v-else>Inacessible</span>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { defineProps } from "@vue/runtime-core";
import { ref } from "vue";
import WebLink from "./WebLink.vue";
const props =
  defineProps<{
    link: string;
    title: string;
  }>();

const loading = ref(true);
const reachable = ref(false);
const timeElapsed = ref(-1);

const startTime = performance.now();
axios
  .get(props.link)
  .then(() => {
    timeElapsed.value = +((performance.now() - startTime) / 1000).toFixed(2);
    reachable.value = true;
    loading.value = false;
  })
  .catch(() => {
    reachable.value = false;
    loading.value = false;
  });
</script>

<style scoped>
.reached {
  background-color: rgb(0, 255, 0, 0.05);
  border-color: green;
}

.notreached {
  background-color: rgb(255, 0, 0, 0.05);
  border-color: red;
}

.loading {
  background-color: rgb(255, 255, 0, 0.05);
  border-color: orange;
}
</style>
