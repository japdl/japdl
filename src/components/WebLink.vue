<template>
  <span class="hover:underline cursor-pointer" @click="shell.openExternal(props.link)">{{
    props.link
  }}</span>
</template>

<script lang="ts" setup>
import { shell } from "electron";
import { defineProps } from "@vue/runtime-core";
const props =
  defineProps<{
    link: string;
  }>();
</script>
