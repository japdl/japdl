<template>
  <div class="wrapper">
    <div id="chooseRange">
      <input
        class="inputText"
        type="number"
        @input="setRange($event.target.value, range.end)"
        min="0"
        :max="max"
        :placeholder="'Numéro de ' + type"
        required
      />
      à
      <input
        class="inputText"
        type="number"
        @input="setRange(range.start, $event.target.value)"
        :min="range.start"
        :max="max"
        :placeholder="'Numéro de ' + type"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ChooseRange",
  props: {
    max: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    range: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    function filterValue(val: string | number) {
      if (typeof val === "string") return val.length ? +val : undefined;
      else return val;
    }

    function setRange(start: string, end: string): void {
      context.emit("update:range", {
        start: filterValue(start),
        end: filterValue(end),
      });
    }
    return {
      filterValue,
      setRange,
    };
  },
});
</script>

<style scoped>
input.inputText {
  width: 200px;
}

.wrapper {
  display: flex;
  justify-content: center;
}

#chooseRange {
  display: flex;
  width: 48%;
  justify-content: space-evenly;
}

select {
  padding: 10px;
}

input {
  text-align: center;
}
</style>
