<template>
  <img :src="imageLink" id="mangaImage" />
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import { ipcRenderer } from "electron";

const props = defineProps<{
  manga: string;
}>();

const website = ipcRenderer.sendSync("website");

const imageLink = `${website}/imgs/mangas/${props.manga}.jpg`;
console.log(imageLink);
</script>
