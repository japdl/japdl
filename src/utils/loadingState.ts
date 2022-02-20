import { ref } from "vue";

export const loading = ref(false);
const loadingTime = ref<null | Date>(null);
let stopTimeout: null | NodeJS.Timeout = null;

let instancesLoading = 0;

export function startLoading(): void {
  if (stopTimeout) {
    clearTimeout(stopTimeout);
  }
  loading.value = true;
  instancesLoading++;
  // if another component is already loading, then
  // it already started spinning, so we can't change
  // the date it started spinning
  if (loadingTime.value === null) {
    loadingTime.value = new Date();
  }
}

export function stopLoading(): void {
  if (!loadingTime.value) return;
  const msElapsed = new Date().getTime() - loadingTime.value.getTime();
  if (instancesLoading > 1) {
    instancesLoading--;
    return;
  }
  instancesLoading--;
  if (msElapsed <= 10) {
    loading.value = false;
    loadingTime.value = null;
    return;
  }
  // need to get ms left for next second
  const msLeft = 1000 - (msElapsed % 1000);
  stopTimeout = setTimeout(() => {
    loading.value = false;
    loadingTime.value = null;
  }, msLeft);
}
