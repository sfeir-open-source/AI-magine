export const uniq = <T>(arr: T[]): T[] => {
  const uniqSet = new Set(arr);
  return Array.from(uniqSet);
};
