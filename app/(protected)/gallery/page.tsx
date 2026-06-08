"use client"
import CreatePostModal from "@/features/posts/components/CreatePostModal";
import { useEffect, useState } from "react";
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

const GalleryPage = () => {
  const LIMIT = 12;

  const authFetch = useAuthFetch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory: "all" | (string & {}) = searchParams.get("category") ?? "all";
  const search = searchParams.get("search") ?? "";

  const [categoriesCount, setCatrgoriesCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("grid");


  const { isLoading: isLoadingPosts, data: postsData } = useQuery({
    queryKey: ["posts", currentPage, search, currentCategory],
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

  function updateFilter(key: "category" | "search", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(`${pathname}?${params}`);
  }

  const handleSearch = useDebouncedCallback((term: string) => {
    setCurrentPage(1);
    updateFilter("search", term);
  }, 300);

  return (
    <section className="flex flex-col flex-1">
      <header className="flex justify-between items-center mb-5">
        <div>
          <h1 className="font-bold text-[18px]">Gallery</h1>
          <p className="font-sans text-sm text-text-3">{postsCount} images across {categoriesCount} categories</p>
        </div>
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
            className="px-4 py-2 rounded-lg duration-200 tracking-[0.06rem] font-bold text-[10px] text-black bg-accent hover:bg-accent/85"
            onClick={() => setShowUploadModal(true)}
          >
            UPLOAD
          </button>
        </div>
        {showUploadModal && <CreatePostModal onExit={() => setShowUploadModal(false)} />}
      </header>
      <div className="flex items-center gap-2 py-1.75 px-3 mb-4 w-full rounded-lg border border-border-2 bg-surface-3">
        <input
          className="text-[12px] w-full"
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
            <button
              key={category.id}
              className={clsx(
                "px-2.5 py-1 rounded-full border text-[10px]",
                category.slug === currentCategory
                  ? "text-accent bg-accent/10"
                  : "text-text-2 border-border-2 hover:text-text"
              )}
              onClick={() =>
                updateFilter("category", category.slug)
              }
            >
              {category.name}
            </button>
          ))}
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