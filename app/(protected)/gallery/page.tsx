"use client"
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, Grid, List, ListFilter, Search } from "lucide-react";
import { EventsGridView } from "@/features/events/components/EventsGridView";
import { EventsListView } from "@/features/events/components/EventsListView";
import PaginationNav from "@/features/events/components/PaginationNav";
import { useDebouncedCallback } from "use-debounce";
import { PageHeader } from "@/features/common/components/PageHeader";
import { GetPostsResponse } from "@/shared/contracts/posts.contract";
import { api } from "@/features/common/lib/api";
import { useModal } from "@/features/common/hooks/useModal";
import { EventFormModal } from "@/features/events/components/EventFormModal";
import { GetCategoriesResponse } from "@/shared/contracts/categories.contract";
import { QUERY_KEYS } from "@/lib/query-keys";
import { Input } from "@/features/common/ui/Input";
import { Button } from "@/features/common/ui/Button";
import { DropdownMenu, DropdownMenuArrow, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/features/common/ui/Dropdown";
import { cn } from "@/features/common/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/common/ui/Select";
import { useQueryParams } from "@/features/common/hooks/useQueryParams";

type SearchParams = {
  category: "all" | (string & {});
  search: string | null;
  from: string | null;
  to: string | null;
  sortBy: "latest" | "oldest";
};

const GalleryPage = () => {
  const LIMIT = 12;

  const { openFormModal } = useModal();
  const {
    params: queryParams, updateSearchParams } = useQueryParams<SearchParams>({
    category: "all",
    from: null,
    to: null,
    search: null,
    sortBy: "latest"
  });

  const {
    category: currentCategory,
    from: dateFrom,
    to: dateTo,
    search,
    sortBy,
  } = queryParams;

  const [categoriesCount, setCategoriesCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("grid");

  const isGrid = displayMode === "grid";


  const eventsQuery = useQuery({
    queryKey: [QUERY_KEYS.EVENTS, currentPage, search, currentCategory, dateFrom, dateTo],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        limit: String(LIMIT),
        page: String(currentPage),
      });

      if (search) {
        searchParams.set("search", search);
      }

      if (currentCategory &&  currentCategory !== "all") {
        searchParams.set("category", currentCategory);
      }

      if (dateFrom) {
        searchParams.set("from", dateFrom);
      }

      if (dateTo) {
        searchParams.set("to", dateTo);
      }

      const response = await api.get(`/gallery/posts?${searchParams}`);

      const data: GetPostsResponse = response.data;

      setEventsCount(data.meta?.pagination.total ?? 0);

      return data;
    }
  });

  const events = eventsQuery.data?.data;
  const eventsPagination = eventsQuery.data?.meta?.pagination;
  const isLoadingEvents = eventsQuery.isLoading;
  const eventsError = eventsQuery.error;

  const categoriesQuery = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const response = await api.get<GetCategoriesResponse>("/gallery/categories");

      return response.data;
    }
  });

  const categories = categoriesQuery.data?.data ?? [];

  useEffect(() => {
    setCategoriesCount(categories?.length ?? 0);
  }, [categories]);

  function handleClearFilters() {
    updateSearchParams({
      category: null,
      from: null,
      to: null
    });
  }

  const handleSearch = useDebouncedCallback((term: string) => {
    setCurrentPage(1);
    updateSearchParams({ search: term || null });
  }, 300);

  const categoriesFilters = [
    { id: "all", name: "All", slug: "all" },
    ...(categories)
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
      updateSearchParams({
        from: null,
        to: null
      });
    } else {
      const filter = dateFilters.find(f => f.value === value);
      if (!filter) return;

      const range = filter.range();
      updateSearchParams({
        from: range.from,
        to: range.to
      });
    }
  }

  return (
    <section className="flex flex-col flex-1">
      <PageHeader title="Gallery" subtitle={`${eventsCount} images across ${categoriesCount} categories`}>
        <div className="flex gap-2">
          <div className="flex overflow-hidden rounded-lg border border-border-secondary">
            <button
              onClick={() => setDisplayMode("list")}
              className={cn(
                "py-1.5 px-2.5",
                displayMode === "list"? "bg-surface-secondary": "hover:bg-surface-primary"
              )}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setDisplayMode("grid")}
              className={cn(
                "py-1.5 px-2.5",
                displayMode === "grid"? "bg-surface-secondary": "hover:bg-surface-primary"
              )}
            >
              <Grid className="h-5 w-5" />
            </button>
          </div>
          <button 
            className="button-primary"
            onClick={() => openFormModal(EventFormModal, {
              title: "Upload Images",
              subtitle: "Add a moment to the archives",
            })}
          >
            UPLOAD
          </button>
        </div>
      </PageHeader>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground-secondary" />
          <Input
            className="pl-9 w-full"
            placeholder="Search archive..."
            defaultValue={search ?? ""}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outlined">
                Filters <ListFilter className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-40 max-w-60" sideOffset={4}>
              <Select
                defaultValue={currentCategory}
                onValueChange={value => (
                  updateSearchParams({
                    category: value === "all" ? null : value
                  })
                )}
              >
                <SelectTrigger className="min-w-0 w-full">
                  <label className="font-medium text-foreground-secondary">Categories:</label>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-70" align="end">
                  {categoriesFilters.map(category => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
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
                    onClick={() => updateSearchParams({ sortBy: sortOption.value })}
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
      <div className="mb-4">
        {isGrid ?
          <EventsGridView isLoading={isLoadingEvents} events={events} />
        :
          <EventsListView isLoading={isLoadingEvents} events={events} />
        }
      </div>
      {(eventsPagination && (eventsPagination.hasNextPage || eventsPagination.hasPreviousPage)) && 
        <PaginationNav
          currentPage={currentPage}
          hasNextPage={eventsPagination.hasNextPage}
          hasPreviousPage={eventsPagination.hasPreviousPage}
          totalPages={eventsPagination.totalPages}
          onPageChange={setCurrentPage}
        />
      }
    </section>
  )
};

export default GalleryPage;