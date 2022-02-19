<template>
  <Container
    class="mb-5 w-full p-3 flex items-center flex-col"
    header="Type de téléchargement"
  >
    <div v-scroll-to class="flex justify-around text-xl w-full">
      <BaseButton
        class="w-full"
        :class="{ selected: type === 'chapitre' }"
        @click="handleEmit('chapitre')"
      >
        Chapitre
      </BaseButton>
      <BaseButton
        class="w-full"
        :class="{ selected: type === 'volume' }"
        @click="handleEmit('volume')"
      >
        Volume
      </BaseButton>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { defineEmits } from "@vue/runtime-core";
import { ref } from "vue";
import Container from "../Container.vue";
import BaseButton from "../BaseButton.vue";

const emit = defineEmits<{
  (event: "type", type: string): void;
}>();

const type = ref("");

const handleEmit = (_type: string) => {
  emit("type", _type);
  type.value = _type;
};
</script>
