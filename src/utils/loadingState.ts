import { ref } from "vue";

export const loading = ref(false);
const loadingTime = ref<null | Date>(null);

export function startLoading(): void {
  loading.value = true;
  // if another component is already loading, then
  // it already started spinning, so we can't change
  // the date it started spinning
  if (loadingTime.value === null) {
    loadingTime.value = new Date();
  }
  console.log("Starting loading at", loadingTime.value);
}

export function stopLoading(): void {
  if (!loadingTime.value) return;
  const msElapsed = new Date().getTime() - loadingTime.value.getTime();
  console.log("Loading took " + msElapsed + "ms");
  if (msElapsed <= 10) {
    loading.value = false;
    loadingTime.value = null;
    return;
  }
  // need to get ms left for next second
  const msLeft = 1000 - (msElapsed % 1000);
  console.log("Waiting " + msLeft + "ms before stopping loading");
  setTimeout(() => {
    loading.value = false;
    loadingTime.value = null;
    console.log("Loading stopped");
  }, msLeft);
}
