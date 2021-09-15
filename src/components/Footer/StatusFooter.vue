<template>
  <div class="bg-gray-400 w-full h-full hover:bg-blue-200 flex justify-center">
    <h1 v-if="!downloads.length">No Downloads yet</h1>
    <div v-else id="downloads">
      <div v-for="(download, index) in downloads" :key="index">
        {{ download }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const downloads = ref(["test"]);
</script>
