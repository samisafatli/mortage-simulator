import { useState, useRef } from "react";
import debounce from "lodash.debounce";

export function useDebouncedState<T>(initialValue: T, delay = 300) {
    const [value, setValue] = useState(initialValue);
    const debouncedSetValue = useRef(debounce(setValue, delay)).current;

    return [value, debouncedSetValue] as const;
}
