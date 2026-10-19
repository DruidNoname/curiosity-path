import {WP_REST_API_Post, WP_REST_API_Tag} from "wp-types";

export interface FeaturedImage {
    full: string;
    thumbnail: string;
    medium: string;
    large: string;
    alt: string;
    caption: string;
}
// Тег записи в том виде, в каком его кладёт в _embedded['wp:term'] запрос с _embed
export type PostTag = Pick<WP_REST_API_Tag, 'id' | 'name' | 'slug' | 'link'>;

export interface PostWithTags extends WP_REST_API_Post {
    postTags: PostTag[];
}

export interface TransformedPost extends PostWithTags {
    featuredImage: FeaturedImage | null;
    featuredImageUrl: string | null;
}

export interface PostsResponse {
    posts: TransformedPost[]; // Важно: здесь должен быть TransformedPost[]
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
}

export interface PostsByTodayResponse {
    posts: WP_REST_API_Post[];
    count: number;
    date: string;
    month: number;
    day: number;
}

export interface SongsResponse {
    songs: TransformedPost[];
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
}