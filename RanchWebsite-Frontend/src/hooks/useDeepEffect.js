import { useRef, useEffect, useMemo } from "react";
import isDeepEqual from "../util/isDeepEqual";

export default function useDeepEffect(effect, dependencies) {
  const prevDeps = useRef(dependencies);
  const triggerRef = useRef(false);

  // eslint-disable-next-line
  const depMemo = useMemo(() => prevDeps.current, [triggerRef.current]);

  const isEqualDeps =
    dependencies?.length > 0 &&
    dependencies.every((item, idx) => isDeepEqual(item, prevDeps.current[idx]));

  if (!isEqualDeps) {
    prevDeps.current = dependencies;
    triggerRef.current = !triggerRef.current;
  }

  // eslint-disable-next-line
  return useEffect(effect, depMemo);
}
