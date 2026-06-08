import { CldImage } from "next-cloudinary"
import { GalleryPost } from "../types"
import dayjs from "dayjs"
import Link from "next/link"

const PostsListLayout = ({ posts }: {
  posts: GalleryPost[]
}) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {posts.map((post: any) => (
        <Link
          key={post.id}
          href={`/gallery/post/${post.id}`}
          className="flex gap-2 h-30 p-1.5 overflow-hidden rounded-lg border border-border bg-surface"
        >
          <div className="relative h-full aspect-square rounded-md overflow-hidden">
            <CldImage
              className="w-full h-full object-cover"
              src={post.coverMedia.secureUrl}
              alt=""
              fill
              sizes="25vw"
            />
          </div>
          <div className="flex flex-col gap-1 justify-between w-full p-2.5">
            <p className="text-[11px] font-sans truncate">{post.title}</p>
            <p className="text-[10px] text-text-3">{dayjs(post.dateOfMoment).format("YYYY-MM-DD")}</p>
            <div className="flex gap-2 justify-between">
              <div className="py-0.5 px-1.75 rounded-[3px] text-[9px] truncate text-accent-3 bg-accent-3/20">{post.category.name}</div>
              <div className="text-[10px] font-sans truncate text-text-3">{post.uploadedByUser.name}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default PostsListLayout;