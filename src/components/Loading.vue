<template>
  <div class="loading">
    <img src="../assets/loading.gif" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Loading",
});
</script>

<style scoped>
img {
  width: 50px;
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
