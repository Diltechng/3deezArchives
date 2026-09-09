"use client"
import { categoriesService } from "@/features/categories/services/categories.service";
import { PageHeader } from "@/features/common/components/PageHeader"
import { useDateFilters } from "@/features/common/hooks/useDateFilters";
import { useQueryParams } from "@/features/common/hooks/useQueryParams";
import { Button } from "@/features/common/ui/Button";
import { DropdownMenu, DropdownMenuArrow, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/features/common/ui/Dropdown";
import { Input } from "@/features/common/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/common/ui/Select";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, ListFilter, Plus, Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

type QueryParams = {
  search?: string;
  from?: string;
  to?: string;
  status?: string;
  sortBy?: string;
}

const CategoriesPage = () => {
  const { params: queryParams, updateQueryParams } = useQueryParams<QueryParams>();
  
  const { search, from: dateFrom, to: dateTo, status, sortBy } = queryParams;
  const { dateOptions, getDateFilterValue } = useDateFilters({ from: dateFrom, to: dateTo });
  
  const handleSearch = useDebouncedCallback(
    (term: string) => {
      updateQueryParams({ search: term ?? null });
    }
  );

  function handleClearFilters() {
    updateQueryParams({
      status: null,
      from: null,
      to: null
    });
  }

  const statusFilters = [
    { id: "all", name: "All", slug: "all" },
  ];

  const sortOptions: { name: string; value: "latest" | "oldest"; }[] = [
    { name: "Latest", value: "latest" },
    { name: "Oldest", value: "oldest" }
  ];

  function updateDateQueryParams(value: string) {
    if (value === "all") {
      updateQueryParams({
        from: null,
        to: null
      });
    } else {
      const filter = dateOptions.find(f => f.value === value);
      if (!filter) return;

      const range = filter.range();
      updateQueryParams({
        from: range.from,
        to: range.to
      });
    }
  }

  const categoriesQuery = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => categoriesService.getCategories(),
  });

  const isLoading = categoriesQuery.isLoading;
  const isError = categoriesQuery.isError;
  const categories = categoriesQuery.data?.data ?? [];

  return (
    <div>
      <PageHeader title="Categories" subtitle="">
        <Button>
          <Plus className="size-4" />
          Add Category
        </Button>
      </PageHeader>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground-secondary" />
          <Input
            className="pl-9 w-full"
            placeholder="Search categories..."
            defaultValue={search ?? ""}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outlined">
              Filters <ListFilter className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40 max-w-60" sideOffset={4}>
            <Select
              defaultValue={status ?? "all"}
              onValueChange={value => (
                updateQueryParams({
                  status: value === "all" ? null : value
                })
              )}
            >
              <SelectTrigger className="min-w-0 w-full">
                <label className="font-medium text-foreground-secondary">Status:</label>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-70" align="end">
                {statusFilters.map(status => (
                  <SelectItem key={status.id} value={status.slug}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              defaultValue={
                dateFrom && dateTo
                  ? getDateFilterValue({
                      from: dateFrom,
                      to: dateTo
                    })
                  : "all"
              }
              onValueChange={updateDateQueryParams}
            >
              <SelectTrigger className="min-w-0 w-full">
                <label className="font-medium text-foreground-secondary">Date:</label>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-70" align="end">
                <SelectItem value="all">
                  All Time
                </SelectItem>
                {dateOptions.map(filter => (
                  <SelectItem key={filter.name} value={filter.value}>
                    {filter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenuItem asChild>
              <Button
                variant="outlined"
                className="hover:bg-surface-secondary"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </DropdownMenuItem>
            <DropdownMenuArrow className="fill-border-primary" />
            <DropdownMenuArrow className="relative -top-0.5" />
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outlined">
              Sort: {
                sortOptions.find(sortOption => sortOption.value === sortBy)?.name
                ?? "Latest"
              }
              <ArrowUpDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40" sideOffset={4}>
            {sortOptions.map(sortOption => (
              <DropdownMenuItem key={sortOption.value} asChild>
                <Button
                  variant="text"
                  className="hover:bg-surface-secondary"
                  onClick={() => updateQueryParams({ sortBy: sortOption.value })}
                >
                  {sortOption.name}
                </Button>
              </DropdownMenuItem>
            ))}
            <DropdownMenuArrow className="fill-border-primary" />
            <DropdownMenuArrow className="relative -top-0.5" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default CategoriesPage;