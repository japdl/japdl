<template>
  <div>
    <Test v-model:options="options" />
    In parent: {{ options }}
  </div>
</template>

<script lang="ts">
import Test from "@/components/Test.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: { Test },
  data() {
    return {
      options: {} as {
        compression: "pdf" | "cbr" | undefined;
        deleteAfter: boolean;
      },
    };
  },
});
</script>
