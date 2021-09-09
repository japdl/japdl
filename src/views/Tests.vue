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
      <div class="flex items-center justify-center transition">
        <svg class="transform -rotate-90 w-72 h-72">
          <circle
            cx="145"
            cy="145"
            :r="circleRadius"
            stroke="currentColor"
            stroke-width="30"
            fill="transparent"
            class="text-gray-700 transition-all duration-500"
          ></circle>

          <circle
            cx="145"
            cy="145"
            :r="circleRadius"
            stroke="currentColor"
            stroke-width="30"
            fill="transparent"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="
              circumference - (selected.percent / 100) * circumference
            "
            class="
              text-blue-500
              hover:text-blue-600
              cursor-pointer
              transition-all
              duration-500
            "
          ></circle>
        </svg>
        <span class="absolute text-6xl">{{ selected.percent }}% </span>
      </div>
      <div>
        <div class="chevron-right" />
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { ref } from "vue";

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

const circumference = 754.2857142857142;
const circleRadius = ref(120);
</script>
