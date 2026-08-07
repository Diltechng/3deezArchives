"use client"
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Grid, List } from "lucide-react";
import { EventsGridView } from "@/features/events/components/EventsGridView";
import { EventsListView } from "@/features/events/components/EventsListView";
import PaginationNav from "@/features/events/components/PaginationNav";
import { useDebouncedCallback } from "use-debounce";
import { GalleryCategory } from "@/features/events/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterChip, { FilterChipSkeleton } from "@/features/events/components/FilterChip";
import PageHeader from "@/features/common/components/PageHeader";
import { GetPostsResponse } from "@/shared/contracts/posts.contract";
import { api } from "@/features/common/lib/api";
import useModal from "@/features/common/hooks/useModal";
import { EventFormModal } from "@/features/events/components/EventFormModal";
import { GetCategoriesResponse } from "@/shared/contracts/categories.contract";

const GalleryPage = () => {
  const LIMIT = 12;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openFormModal } = useModal();

  const currentCategory: "all" | (string & {}) = searchParams.get("category") ?? "all";
  const search = searchParams.get("search") ?? "";
  const dateFrom = searchParams.get("from") ?? "";
  const dateTo = searchParams.get("to") ?? "";

  const [categoriesCount, setCategoriesCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("grid");
  const [activeDateFilter, setActiveDateFilter] = useState("");

  const isGrid = displayMode === "grid";


  const eventsQuery = useQuery({
    queryKey: ["events", currentPage, search, currentCategory, dateFrom, dateTo],
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
    queryKey: ["categries"],
    queryFn: async () => {
      const response = await api.get<GetCategoriesResponse>("/gallery/categories");

      return response.data;
    }
  });

  const categoriesError = categoriesQuery.error;
  const isLoadingCategories = categoriesQuery.isLoading;
  const categories = categoriesQuery.data?.data;

  useEffect(() => {
    setCategoriesCount(categories?.length ?? 0);
  }, [categories]);

  function clearFilters() {
    updateFilter({
      key: "category",
      value: ""
    }, {
      key: "from",
      value: ""
    }, {
      key: "to",
      value: ""
    });
    setActiveDateFilter("")
  }

  function updateFilter(...items: { 
    key: "category" | "search" | "from" | "to";
    value: string;
  }[]) {
    const params = new URLSearchParams(searchParams.toString());
    
    for (const { key, value } of items) {
      if (!value) {
        params.delete(key);
      } else if (value === "all") {
        return clearFilters();
      } else {
        params.set(key, value);
      }
    }

    router.replace(`${pathname}?${params}`);
  }

  const handleSearch = useDebouncedCallback((term: string) => {
    setCurrentPage(1);
    updateFilter({ key: "search", value: term });
  }, 300);

  return (
    <section className="flex flex-col flex-1">
      <PageHeader title="Gallery" subtitle={`${eventsCount} images across ${categoriesCount} categories`}>
        <div className="flex gap-2">
          <div className="flex overflow-hidden rounded-lg border border-border-2">
            <button
              onClick={() => setDisplayMode("list")}
              className={clsx(
                "py-1.5 px-2.5",
                displayMode === "list"? "": "bg-surface-3 hover:bg-surface-2/70"
              )}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setDisplayMode("grid")}
              className={clsx(
                "py-1.5 px-2.5",
                displayMode === "grid"? "": "bg-surface-3 hover:bg-surface-2/70"
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
      <div className="input-core mb-4">
        <input
          className="w-full"
          placeholder="Search archive..."
          defaultValue={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {isLoadingCategories
          ? [...Array(4)].map((_, i) => <FilterChipSkeleton key={i} />)
          : categories && <>
            {[
              { id: "all", name: "All", slug: "all" },
              ...categories
            ].map((category: GalleryCategory) => (
              <FilterChip
                key={category.id}
                name={category.name}
                active={category.slug === currentCategory}
                onClick={() =>
                  updateFilter({ key: "category", value: category.slug })
                }
              />
            ))}
            {[{
              name: "2025",
              from: "2025-01-01",
              to: "2025-12-31"
            }, {
              name: "2026",
              from: "2026-01-01",
              to: "2026-12-31",
            }].map(date =>
              <FilterChip
                key={date.name}
                name={date.name}
                active={activeDateFilter === date.name}
                onClick={() => {
                  updateFilter(
                    { key: "from", value: date.from },
                    { key: "to", value: date.to }
                  );
                  setActiveDateFilter(date.name);
                }}
              />
            )}
          </>
        }
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