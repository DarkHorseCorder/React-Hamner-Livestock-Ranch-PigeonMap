import { useRef, useEffect } from "react";

export default function useAbortEffect(effect, dependencies) {
  const controllerRef = useRef(new AbortController());

  useEffect(() => {
    controllerRef.current = new AbortController();

    const { signal } = controllerRef.current;
    const cleanupFunction = effect(signal);

    return () => {
      //eslint-disable-next-line
      controllerRef.current?.abort();

      if (typeof cleanupFunction === "function") {
        cleanupFunction();
      }
    };

    // eslint-disable-next-line
  }, dependencies);
}
