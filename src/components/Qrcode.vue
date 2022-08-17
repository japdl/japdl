<template>
  <h1 v-if="error">
    Une erreur est survenue lors de la création du QR code: {{ error }}
  </h1>
  <canvas v-else class="rounded-2xl" ref="canvas"></canvas>
</template>

<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import qrcode from "qrcode";
import { onMounted, defineProps } from "vue";

const props = defineProps<{
  data: string;
}>();
const canvas = ref(null);
const error = ref("");
if (!props.data) {
  error.value = "Aucun texte à convertir en QR code";
}
onMounted(() => {
  if (error)
    qrcode.toCanvas(canvas.value, props.data, (err) => {
      if (!err) return;
      error.value = err.message;
    });
});
</script>
