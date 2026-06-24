"use client"
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Grid, List } from "lucide-react";
import PostsGridView from "@/features/posts/components/PostsGridView";
import PostsListView from "@/features/posts/components/PostsListView";
import PaginationNav from "@/features/posts/components/PaginationNav";
import { useDebouncedCallback } from "use-debounce";
import { GalleryCategory } from "@/features/posts/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterChip, { FilterChipSkeleton } from "@/features/posts/components/FilterChip";
import ContentHeader from "@/features/shared/components/ContentHeader";
import { GetPostsResponse } from "@/shared/contracts/posts";
import { api } from "@/features/shared/lib/api";
import useModal from "@/features/shared/hooks/useModal";
import CreatePostForm from "@/features/posts/components/CreatePostForm";

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

  const [categoriesCount, setCatrgoriesCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("grid");
  const [activeDateFilter, setActiveDateFilter] = useState("");

  const isGrid = displayMode === "grid";


  const { isLoading: isLoadingPosts, data: postsData, error: postsError, } = useQuery({
    queryKey: ["posts", currentPage, search, currentCategory, dateFrom, dateTo],
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

      setPostsCount(data.meta?.pagination.total ?? 0);

      return data;
    }
  });

  const { error: categoriesError, isLoading: isLoadingCategories, data: categoriesData } = useQuery({
    queryKey: ["categries"],
    queryFn: async () => {
      const response = await api.get("/gallery/categories");

      const data = response.data;
      setCatrgoriesCount(data.data.length);

      return data;
    }
  });

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
      <ContentHeader title="Gallery" subtitle={`${postsCount} images across ${categoriesCount} categories`}>
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
            onClick={() => openFormModal(CreatePostForm, {
              title: "Upload Images",
              subtitle: "Add a moment to the archives",
              categories: categoriesData.data
            })}
          >
            UPLOAD
          </button>
        </div>
      </ContentHeader>
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
          : <>
            {[
              { id: "all", name: "All", slug: "all" },
              ...categoriesData.data
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
          <PostsGridView isLoading={isLoadingPosts} posts={postsData?.data} />
        :
          <PostsListView isLoading={isLoadingPosts} posts={postsData?.data} />
        }
      </div>
      {postsData?.meta && 
        <PaginationNav
          currentPage={currentPage}
          hasNextPage={postsData.meta.pagination.hasNextPage}
          hasPreviousPage={postsData.meta.pagination.hasPreviousPage}
          totalPages={postsData.meta.pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      }
    </section>
  )
};

export default GalleryPage;