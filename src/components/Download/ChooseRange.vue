<template>
  <div class="flex justify-center items-center my-5">
    <input
      :value="range.start"
      type="number"
      step="any"
      @input="setRange(($event?.target as HTMLTextAreaElement).value, range.end)"
      min="0"
      :max="max"
      :placeholder="placeholder"
      required
    />
    <span class="ml-2 mr-2 text-xl">à</span>
    <input
      :value="range.end"
      class="inputText"
      type="number"
      step="any"
      @input="setRange(range.start, ($event?.target as HTMLTextAreaElement).value)"
      :min="range.start"
      :max="max"
      :placeholder="placeholder"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "@vue/runtime-core";
import { computed } from "vue";

const props = defineProps<{
  max: number;
  type: string;
  range: { start?: number; end?: number };
}>();

const emits = defineEmits<{
  (event: "update:range", range: { start?: number; end?: number }): void;
}>();

const placeholder = computed(() => {
  return `Numéro de ${props.type}`;
});

function filterValue(val?: string | number) {
  if (typeof val === "string") {
    if (val.length) return +val;
    else return 0;
  } else return val;
}

function setRange(
  start?: string | number | null,
  end?: string | number | null
): void {
  emits("update:range", {
    start: filterValue(start ?? undefined),
    end: filterValue(end ?? undefined),
  });
}
</script>

<style scoped>
input {
  @apply text-center p-1 rounded-xl text-lg min-w-min;
}

input:invalid:not(:placeholder-shown) {
  color: red;
  @apply line-through;
}

input:valid:not(:placeholder-shown) {
  color: green;
  @apply font-bold;
}

select {
  padding: 10px;
}
</style>
