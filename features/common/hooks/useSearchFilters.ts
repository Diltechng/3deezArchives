import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

function useSearchFilters<T extends string>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function clearFilters(...keys: T[]) {
    const params = new URLSearchParams(searchParams.toString());

    keys.forEach((key) => params.delete(key));

    router.replace(`${pathname}?${params}`)
  }

  function updateFilters(...items: { 
    key: T;
    value: string;
  }[]) {
    const params = new URLSearchParams(searchParams.toString());
    
    for (const { key, value } of items) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.replace(`${pathname}?${params}`)
  }

  function getFilter(key: T, defaultValue = "") {
    return searchParams.get(key) ?? defaultValue;
  }

  const values = useMemo(
    () => Object.fromEntries(searchParams.entries()) as Partial<Record<T, string>>,
    [searchParams]
  );

  const hasFilters = useMemo(
    () => !![...searchParams.entries()].length,
    [searchParams]
  )

  return {
    values,
    hasFilters,
    clearFilters,
    updateFilters,
  }
}

export default useSearchFilters;