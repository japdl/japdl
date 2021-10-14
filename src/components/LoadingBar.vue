<template>
  <div id="loadingBar" class="w-full">
    <div id="fill" :style="widthStyle" class="flex items-center justify-center">
      <span>{{ roundedPercent }}%</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
const props = defineProps({
  done: {
    type: Number,
    default: 0,
  },
});
const roundedPercent = computed(() => Math.round(props.done));

const computedWidth = computed(() => {
  return props.done <= 100 ? props.done : 100;
});
const widthStyle = computed(() => {
  return `width: ${computedWidth.value}%`;
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
