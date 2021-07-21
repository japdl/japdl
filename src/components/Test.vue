<template>
  <div id="downloadOptions" @input="syncOptions">
    Options: {{ options }} <br />
    compression: {{ state.compression }} <br />
    deleteAfter: {{ !state.images }}
    <div class="downloadOption">
      <input type="checkbox" v-model="state.images" value="images" />
      <label>Télécharger les images en .jpg</label>
    </div>
    <div class="downloadOption">
      <input type="radio" v-model="state.compression" value="pdf" />
      <label>Créer un fichier PDF</label>
    </div>
    <div class="downloadOption">
      <input type="radio" v-model="state.compression" value="cbr" />
      <label>Créer un fichier CBR</label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  setup(props, context) {
    const state = reactive({
      compression: undefined as string | undefined,
      images: false as boolean,
    });

    const methods = {
      syncOptions() {
        const newOptions = {
          compression: state.compression,
          deleteAfter: state.images,
        };
        console.log(newOptions);
        context.emit("update:options", newOptions);
      },
    };
    return {
      state,
      ...methods,
    };
  },
});
</script>
