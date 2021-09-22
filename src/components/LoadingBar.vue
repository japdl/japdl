<template>
  <div id="loadingBar" class="w-full">
    <div
      id="fill"
      :style="'width:' + done + '%'"
      class="flex items-center justify-center"
    >
      <span>{{ done }} %</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    done: Number,
  },
});
</script>

<style scoped>
#loadingBar {
  width: 100%;
  height: 20px;
}
#fill {
  height: 100%;
  background-image: linear-gradient(
    to right,
    var(--dark-primary),
    var(--primary)
  );
  text-align: center;
  color: white;
}

div {
  transition: ease 2s;
  border-radius: 20px;
}
</style>
