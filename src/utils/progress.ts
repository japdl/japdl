export const progress = (current: number, total: number): number => {
  return +((current / total) * 100).toFixed(2);
};
