"use client"
import CreatePostModal from "@/features/posts/components/CreatePostModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/features/auth/hooks/useAuthFetch";
import Loader from "@/features/shared/components/Loader";
import clsx from "clsx";
import { Grid, List } from "lucide-react";
import PostsGridLayout from "@/features/posts/components/PostsGridLayout";
import PostsListLayout from "@/features/posts/components/PostsListLayout";
import PaginationNav from "@/features/posts/components/PaginationNav";
import { useDebouncedCallback } from "use-debounce";
import { GalleryCategory } from "@/features/posts/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterChip from "@/features/posts/components/FilterChip";
import ContentHeader from "@/features/shared/components/ContentHeader";

const GalleryPage = () => {
  const LIMIT = 12;

  const authFetch = useAuthFetch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory: "all" | (string & {}) = searchParams.get("category") ?? "all";
  const search = searchParams.get("search") ?? "";
  const dateFrom = searchParams.get("from") ?? "";
  const dateTo = searchParams.get("to") ?? "";

  const [categoriesCount, setCatrgoriesCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("grid");
  const [activeDateFilter, setActiveDateFilter] = useState("");


  const { isLoading: isLoadingPosts, data: postsData } = useQuery({
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

      const response = await authFetch(`/api/v1/gallery/posts?${searchParams}`);

      const data = await response.json();
      setPostsCount(data.pagination.total)

      return data;
    }
  });

  const { error: categoriesError, isLoading: isLoadingCategories, data: categoriesData } = useQuery({
    queryKey: ["categries"],
    queryFn: async () => {
      const response = await authFetch("/api/v1/gallery/categories");

      const data = await response.json();
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
            onClick={() => setShowUploadModal(true)}
          >
            UPLOAD
          </button>
        </div>
        {showUploadModal && <CreatePostModal
          categories={categoriesData.data}
          onExit={() => setShowUploadModal(false)}
        />}
      </ContentHeader>
      <div className="input-core mb-4">
        <input
          className="w-full"
          placeholder="Search archive"
          defaultValue={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      {isLoadingCategories
        ? <div className="flex h-10 mb-3.5">
          <Loader />
        </div>
        : (categoriesError || !categoriesData.success)
        ? <div></div>
        : <div className="flex flex-wrap gap-1.5 mb-3.5">
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
        </div>
      }


      {isLoadingPosts
        ? <div className="flex flex-1 w-full">
          <Loader />
        </div>

        : (!postsData.success)
        ? <div></div>
        : (
          <>
            <div className="mb-4">
              {displayMode === "grid" ?
                <PostsGridLayout posts={postsData.data} />
              : displayMode === "list" &&
                <PostsListLayout posts={postsData.data} />
              }
            </div>
            <PaginationNav
              currentPage={currentPage}
              hasNextPage={postsData.pagination.hasNextPage}
              hasPreviousPage={postsData.pagination.hasPreviousPage}
              totalPages={postsData.pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )
      }
    </section>
  )
};

export default GalleryPage;