import { INVALID_STATE, type InvalidState } from "../types";

export function isInvalidIntent(state: string): state is InvalidState {
  return INVALID_STATE.includes(state as InvalidState);
}
