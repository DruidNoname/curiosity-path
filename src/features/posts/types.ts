import {WP_REST_API_Post} from "wp-types";

export interface FeaturedImage {
    full: string;
    thumbnail: string;
    medium: string;
    large: string;
    alt: string;
    caption: string;
}
export interface TransformedPost extends WP_REST_API_Post {
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
