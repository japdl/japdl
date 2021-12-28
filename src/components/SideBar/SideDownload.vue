<template>
  <li class="flex flex-col gap-2 p-2">
      <h2 class="text-center">dummy-name type foo-bar</h2>
      <LoadingBar :done="50" :show="false" />
  </li>
</template>

<script lang="ts" setup>
import LoadingBar from '../LoadingBar.vue';

</script>

<style scoped>
</style>
