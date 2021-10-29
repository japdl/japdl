<template>
  <Container :title="title">
    <div v-for="(variable, name) in props.state" :key="name">
      <strong>{{ name }}</strong>
      {{ typeof variable === "string" ? '"' + variable + '"' : variable }}
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import Container from "./Container.vue";

const props = defineProps({
  state: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: false,
    default: "variables",
  },
});
</script>
