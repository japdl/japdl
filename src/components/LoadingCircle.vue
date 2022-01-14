<template>
  <div class="flex items-center justify-center transition">
    <svg class="transform -rotate-90">
      <circle
        cx="50%"
        cy="50%"
        :r="radius"
        stroke="currentColor"
        :stroke-width="radius / 4"
        fill="transparent"
        class="text-gray-700 transition-all duration-500"
      ></circle>

      <circle
        cx="50%"
        cy="50%"
        :r="radius"
        stroke="currentColor"
        :stroke-width="radius / 4"
        fill="transparent"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="
          circumference - (props.percent / 100) * circumference
        "
        class="text-blue-500 hover:text-blue-600 cursor-pointer transition-all duration-500"
      ></circle>
    </svg>
    <span class="relative -left-2/4">{{ props.percent }}% </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
const props = defineProps({
  radius: {
    type: Number,
    required: true,
  },
  percent: {
    type: Number,
    required: true,
  },
});
console.log("Radius:", props.radius);
console.log("percent:", props.percent);
const circumference = computed(() => 2 * Math.PI * props.radius);
</script>
