<template>
  <Container class="w-full p-3 flex items-center flex-col" :header="header">
    <div v-scroll-to class="flex justify-around text-xl w-full">
      <BaseButton
        class="w-full"
        :class="{ selected: choice === Choice.First }"
        @click="handleEmit(Choice.First)"
      >
        {{ first }}
      </BaseButton>
      <BaseButton
        class="w-full"
        :class="{ selected: choice === Choice.Second }"
        @click="handleEmit(Choice.Second)"
      >
        {{ second }}
      </BaseButton>
    </div>
  </Container>
</template>

<script lang="ts">
export enum Choice {
  None = -1,
  First = 0,
  Second = 1,
}
</script>

<script lang="ts" setup>
import { defineEmits } from "@vue/runtime-core";
import { ref, watch } from "vue";
import Container from "./Container.vue";
import BaseButton from "./BaseButton.vue";
import { defineProps } from "vue";
import { ipcRenderer } from "electron";

const props = defineProps<{
  header?: string;
  selected?: Choice;
  first: string;
  second: string;
}>();

const emit = defineEmits<{
  (event: "choice", choice: Choice): void;
}>();

const choice = ref(props.selected ?? Choice.None);

watch(
  () => props.selected,
  (val) => {
    choice.value = val ?? Choice.None;
  }
);

function handleEmit(_choice: Choice) {
  emit("choice", _choice);
  ipcRenderer.send("log", "emitting choice" + _choice);
  choice.value = _choice;
}
</script>
