<template>
  <main class="grid w-full min-h-screen bg-gray-900 place-content-center">
    <section
      class="
        p-6
        bg-gray-800
        rounded-xl
        md:grid md:grid-cols-2
        md:gap-4
        space-y-6
        sm:space-y-0
      "
    >
      <div class="grid grid-cols-2 gap-6">
        <button
          class="
            border-t-4
            px-4
            py-2
            text-xl text-gray-100
            transition
            duration-1000
            bg-blue-600
            rounded-md
            h-14
            w-44
            hover:bg-blue-700
            font-bold
            ring-2 ring-gray-100
          "
          v-for="(skill, index) in skills"
          :key="index"
          @click="selectLanguage(skill)"
        >
          <span>{{ skill.name }}</span>
        </button>
      </div>
      <LoadingCircle :radius="circleRadius" :percent="selected.percent" />
      <div>
        <div class="chevron-right" />
      </div>
      <p>{{ circleRadius }}</p>
      <input type="range" step="10" max="500" v-model="circleRadius" />
    </section>
  </main>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import LoadingCircle from "@/components/LoadingCircle.vue";

const skills = [
  { name: "HTML", percent: 70 },
  { name: "CSS", percent: 60 },
  { name: "Tailwind CSS", percent: 20 },
  { name: "JavaScript", percent: 90 },
  { name: "Electron", percent: 85 },
  { name: "Vue", percent: 95 },
  { name: "Test", percent: 100 },
];

let selected = ref(skills[0]);
function selectLanguage(skill: { name: string; percent: number }) {
  selected.value = skill;
}

const circleRadius = ref(120);
</script>

<style scoped>
.custom {
  border: 2px solid black;
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.child {
}
</style>
