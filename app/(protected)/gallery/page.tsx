"use client"
import CreatePostModal from "@/features/posts/components/CreatePostModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/features/auth/hooks/useAuthFetch";

const GalleryPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const authFetch = useAuthFetch();

  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: async (): Promise<{ id: string; }[]> => {
      const response = await authFetch(`/api/v1/gallery/posts?limit=${limit}&page=${page}`);
      const data = await response.json();
      return data.data;
    }
  });

  console.log(data);

  if (error) {
    return <p>{error.message}</p>
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <section>
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-3xl text-heading">Gallery</h1>
          <h2 className="text-sm text-subheading">Add a post to the archives</h2>
        </div>
        <button 
          className="px-3 py-2 rounded-lg duration-200 text-accent-text bg-accent hover:bg-accent-hover btn"
          onClick={() => setShowUploadModal(true)}
        >
          Upload
        </button>
        {showUploadModal && <CreatePostModal onExit={() => setShowUploadModal(false)} />}
      </header>
      <div className="grid grid-cols-4">
        {data && data.map(post => <div key={post.id}>{post.id}</div>)}
      </div>
    </section>
  )
};

export default GalleryPage;