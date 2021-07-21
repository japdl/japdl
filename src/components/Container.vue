<template>
  <fieldset>
    <legend :style="'font-size:' + titleSize + 'px;'">
      {{ title }}
      <slot name="title"></slot>
    </legend>
    <slot></slot>
  </fieldset>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      default: "Catégorie",
    },
    titleSize: {
      type: Number,
      default: 16,
    },
  },
});
</script>

<style scoped>
fieldset {
  border-radius: 6px;
  border-color: var(--text-color);
  border-width: 2px;
}
legend {
  display: flex;
  align-items: center;
  margin: 0 auto;
}
</style>
