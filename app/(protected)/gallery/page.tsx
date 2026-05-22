"use client"
import CreatePostModal from "@/features/posts/components/CreatePostModal";
import { useState } from "react";

const GalleryPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <section>
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-3xl text-heading">Gallery</h1>
          <h2 className="text-sm text-subheading">Add a moment to the archives</h2>
        </div>
        <button 
          className="px-3 py-2 rounded-lg duration-200 text-accent-text bg-accent hover:bg-accent-hover btn"
          onClick={() => setShowUploadModal(true)}
        >
          Upload
        </button>
        {showUploadModal && <CreatePostModal onExit={() => setShowUploadModal(false)} />}
      </header>
      <div>

      </div>
    </section>
  )
};

export default GalleryPage;