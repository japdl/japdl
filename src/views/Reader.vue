<template>
  <!-- <div class="container mx-auto">
    <ChooseFolder @selected="registerFolder" />
    Folder choosen is: {{ folder }}
  </div> -->
  <ViewMangaTree manga="one-piece" />
</template>

<script lang="ts" setup>
import ViewMangaTree from "@/components/MangaTree/MangaTree.vue";
import { ref } from "vue";

const folder = ref("");

function registerFolder(folders: string[]) {
  folder.value = folders[0];
}
</script>