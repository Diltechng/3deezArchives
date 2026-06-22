import { GetPostsMeta, PostSummary } from "@/modules/gallery";
import { ResponseData } from "./api";

export type GetPostsResponse = ResponseData<PostSummary[], GetPostsMeta>;