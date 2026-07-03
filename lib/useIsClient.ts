import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** True after hydration — avoids setState-in-effect for client-only UI. */
export function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
