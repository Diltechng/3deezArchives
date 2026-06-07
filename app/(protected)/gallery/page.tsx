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

const GalleryPage = () => {
  const limit = 12;
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState("All");
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("grid");

  const authFetch = useAuthFetch();

  const { isLoading, data } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: async () => {
      const response = await authFetch(`/api/v1/gallery/posts?limit=${limit}&page=${currentPage}`);
      return await response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex w-full h-full">
        <Loader />
      </div>
    )
  }

  return (
    <section>
      <header className="flex justify-between items-center mb-5">
        <div>
          <h1 className="font-bold text-[18px]">Gallery</h1>
          <p className="font-sans text-sm text-text-3">248 images across 8 categories</p>
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
        />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {["All", "Events", "Milestones", "Media", "Studio", "2025", "2026"].map(filter => (
          <button
            key={filter}
            className={clsx(
              "px-2.5 py-1 rounded-full border text-[10px]",
              filter === activeFilter
                ? "text-accent bg-accent/10"
                : "text-text-2 border-border-2 hover:text-text"
            )}
            onClick={() =>
              setActiveFilter(filter)
            }
          >
            {filter}
          </button>
        ))}
      </div>
      {displayMode === "grid" ?
        <PostsGridLayout posts={data.data} />
      : displayMode === "list" &&
        <PostsListLayout posts={data.data} />
      }
      <PaginationNav
        currentPage={currentPage}
        hasNextPage={data.pagination.hasNextPage}
        hasPreviousPage={data.pagination.hasPreviousPage}
        totalPages={data.pagination.totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  )
};

export default GalleryPage;