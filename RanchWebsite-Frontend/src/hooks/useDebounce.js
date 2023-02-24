import { useState, useEffect } from "react";

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const eventHandler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(eventHandler);
  });

  return debouncedValue;
};

export default useDebounce;
