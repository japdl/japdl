<template>
  <div class="flex justify-center">
    <div id="choose" class="container">
      <ChooseManga @manga="redirectToDownload" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChooseManga from "@/components/ChooseManga.vue";
import router from "@/router";
import { SearchInfos } from "japscandl/js/src/utils/types";
const redirectToDownload = (manga: SearchInfos) => {
  router.push({
    name: "Download",
    params: {
      manga: manga.japscan,
    },
  });
};
</script>
