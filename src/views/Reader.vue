<template>
  <div class="container mx-auto">
    <ChooseFolder @selected="registerFolder" />
    Folder choosen is: {{ folder }}
  </div>
</template>

<script lang="ts" setup>
import ChooseFolder from "@/components/ChooseFolder.vue";
import { ref } from "vue";

const folder = ref("");

function registerFolder(folders: string[]) {
  folder.value = folders[0];
}
</script>
