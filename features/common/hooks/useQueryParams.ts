import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Nullable<T extends Record<string, unknown>> = { [P in keyof T]: T[P] | null };

function useQueryParams<T extends Record<string, string | null>>(defaultQueryParams?: T) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function updateSearchParams(queryParams: Partial<Nullable<T>>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(queryParams)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.replace(`${pathname}?${params}`);
  }
  
  return {
    updateSearchParams,
    params: Object.fromEntries(
      [
        ...searchParams
          .entries()
          .map(([key, value]) => [
            key,
            value
          ]),
        ...(defaultQueryParams
          ? Object
            .entries(defaultQueryParams)
            .map(([key, value]) => [
              key,
              searchParams.get(key) ?? value
            ])
          : []
        ),
      ]
    ) as T,
  }
}

export { useQueryParams };