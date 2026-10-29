import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns true after the component has hydrated on the client.
 * Safe replacement for the `mounted` effect pattern (avoids setState-in-effect).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
