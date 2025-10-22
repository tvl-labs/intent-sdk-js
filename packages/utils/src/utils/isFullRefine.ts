import type { RefineResult } from "../types/medusa";

export function isFullRefine(object: unknown): object is RefineResult {
  if (typeof object !== "object") return false;
  return Boolean(object && "Refinement" in object);
}
