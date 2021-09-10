<template>
  <fieldset class="p-2">
    <legend>
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
