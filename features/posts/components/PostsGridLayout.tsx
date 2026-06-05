import { CldImage } from "next-cloudinary"
import { GalleryPost } from "../types"
import dayjs from "dayjs"

const PostsGridLayout = ({ posts }: {
  posts: GalleryPost[]
}) => {
 return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {posts.map((post) => (
        <div key={post.id} className="flex flex-col overflow-hidden rounded-lg border border-border">
          <div className="relative w-full aspect-square">
            <CldImage
              className="w-full h-full object-cover"
              src={post.coverMedia.secureUrl}
              alt=""
              fill
              sizes="25vw"
            />
          </div>
          <div className="flex flex-col gap-1 p-2.5 border-t border-border bg-surface">
            <p className="text-[11px] font-sans truncate">{post.title}</p>
            <p className="text-[10px] text-text-3">{dayjs(post.dateOfMoment).format("YYYY-MM-DD")}</p>
            <div className="flex gap-2 justify-between">
              <div className="py-0.5 px-1.75 rounded-[3px] text-[9px] truncate text-accent-3 bg-accent-3/20">{post.category.name}</div>
              <div className="text-[10px] font-sans truncate text-text-3">{post.uploadedByUser.name}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
 )
}

export default PostsGridLayout;