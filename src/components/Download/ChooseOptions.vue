<template>
  <Container title="Options de téléchargement">
    <div class="downloadOption">
      <label>
        <input type="checkbox" v-model="state.images" value="images" />
        Télécharger les images</label
      >
    </div>
    <div class="downloadOption">
      <label>
        <input type="radio" v-model="state.compression" value="pdf" />
        Créer un fichier PDF</label
      >
    </div>
    <div class="downloadOption">
      <label>
        <input type="radio" v-model="state.compression" value="cbr" />
        Créer un fichier CBR</label
      >
    </div>
    <div class="downloadOption">
      <label>
        <input type="radio" v-model="state.compression" value="" />
        Ne pas créer de fichier</label
      >
    </div>
  </Container>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from "vue";
import Container from "../Container.vue";

export default defineComponent({
  components: { Container },
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const state = reactive({
      compression: "",
      images: false,
    });
    onMounted(() => {
      context.emit("update:options", {
        compression: state.compression,
        images: state.images,
      });
    });

    watch(
      () => state.compression,
      (newCompression) => {
        context.emit("update:options", {
          compression: newCompression,
          images: state.images,
        });
      }
    );

    watch(
      () => state.images,
      (newImage) => {
        context.emit("update:options", {
          compression: state.compression,
          images: newImage,
        });
      }
    );

    return {
      state,
    };
  },
});
</script>

<style scoped></style>
