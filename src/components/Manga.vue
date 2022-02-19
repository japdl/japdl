<template>
  <div
    class="mb-5 max-w-md mx-auto bg-white hover:opacity-75 transition-all rounded-xl shadow-xl overflow-hidden md:max-w-2xl"
  >
    <div class="md:flex">
      <div class="md:flex-shrink-0">
        <img
          class="h-48 w-full object-cover md:h-full md:w-48"
          :src="imageLink"
        />
      </div>
      <div class="p-8">
        <span
          class="font-manga uppercase tracking-wide text-primary font-semibold text-2xl"
        >
          {{ props.infos.name }}
        </span>
        <br />
        <span
          @click.prevent.stop="openExternalLink(mangaLink)"
          class="text-lg leading-tight font-medium text-black hover:underline cursor-pointer"
          >Voir sur Japscan</span
        >
        <div class="text-gray-800">
          <div class="text-gray-500">
            <div v-if="props.infos.original_name">
              <i>Nom original:</i> {{ props.infos.original_name }}
            </div>
            <div v-if="props.infos.alternate_names">
              <i>Nom(s) alternatifs:</i> {{ props.infos.alternate_names }}
            </div>
            <div v-if="props.infos.mangakas">
              <i>mangaka(s):</i> {{ props.infos.mangakas }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { shell } from "electron";

const props = defineProps({
  infos: {
    type: Object,
    required: true,
  },
});

const japscanMangaName = props.infos.url.split("/")[2];

const imageLink = computed(() => {
  return `https://japscan.ws/imgs/mangas/${japscanMangaName}.jpg`;
});

const mangaLink = computed(() => {
  return `https://www.japscan.ws/manga/${japscanMangaName}/`;
});

function openExternalLink(link: string) {
  shell.openExternal(link);
}
</script>
