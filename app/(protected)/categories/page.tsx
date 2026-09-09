"use client"
import { PageHeader } from "@/features/common/components/PageHeader"
import { useQueryParams } from "@/features/common/hooks/useQueryParams";
import { Button } from "@/features/common/ui/Button";
import { DropdownMenu, DropdownMenuArrow, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/features/common/ui/Dropdown";
import { Input } from "@/features/common/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/common/ui/Select";
import { ArrowUpDown, ListFilter, Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

type QueryParams = {
  search: string | null;
  from: string | null;
  to: string | null;
  status: string | null;
  sortBy: string | null;
}

const CategoriesPage = () => {
  const { params: queryParams, updateQueryParams } = useQueryParams<QueryParams>({
    search: null,
    from: null,
    to: null,
    status: null,
    sortBy: null,
  });

  const { search, from: dateFrom, to: dateTo, status, sortBy } = queryParams;

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

  const dateFilters = [
    {
      name: "Yesterday",
      value: "yesterday",
      range() {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        return {
          from: yesterday.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0],
        }
      }
    },
    {
      name: "Last Week",
      value: "last_week",
      range() {
        const now = new Date();
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);

        return {
          from: lastWeek.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0]
        }
      }
    },
    {
      name: "Last Month",
      value: "last_month",
      range() {
        const now = new Date();
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);

        return {
          from: lastMonth.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0]
        }
      }
    },
    {
      name: "Last Year",
      value: "last_year",
      range() {
        const now = new Date();
        const lastYear = new Date(now);
        lastYear.setFullYear(now.getFullYear() - 1);

        return {
          from: lastYear.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0]
        }
      }
    },
    {
      name: "Custom Range",
      value: "custom_range",
      range() {
        return {
          from: dateFrom ?? "",
          to: dateTo ?? ""
        }
      }
    }
  ];

  const sortOptions: { name: string; value: "latest" | "oldest"; }[] = [
    { name: "Latest", value: "latest" },
    { name: "Oldest", value: "oldest" }
  ];

  function getDateFilterValue(date: { from: string; to: string; }) {
    return dateFilters.find(filter => {
      const range = filter.range();

      return range.from === date.from &&
        range.to === date.to;
    })?.value || "custom_range"
  }

  function updateDateQueryParams(value: string) {
    if (value === "all") {
      updateQueryParams({
        from: null,
        to: null
      });
    } else {
      const filter = dateFilters.find(f => f.value === value);
      if (!filter) return;

      const range = filter.range();
      updateQueryParams({
        from: range.from,
        to: range.to
      });
    }
  }

  return (
    <div>
      <PageHeader title="Categories" subtitle="" />
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
                {dateFilters.map(filter => (
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