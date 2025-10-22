export function isSameETHAddress(a: string, b: string) {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}
