<template>
  <img :src="imageLink" id="mangaImage" />
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";

const props = defineProps<{
  manga: string;
}>();

const imageLink = `https://japscan.ws/imgs/mangas/${props.manga}.jpg`;
</script>
