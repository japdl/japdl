<template>
  <button><slot></slot></button>
</template>

<style scoped>
button {
  border: none;
  outline: none;
  @apply select-none mx-1 uppercase cursor-pointer rounded-2xl text-center p-2 bg-dark-primary text-white transition-all duration-200;
}

button.selected {
  @apply bg-primary;
}

button:enabled:hover {
  @apply bg-primary;
  transform: translateX(2px);
}

button:disabled {
  @apply bg-gray-400 text-gray-600 cursor-not-allowed;
}
</style>
