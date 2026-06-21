import { useQuery } from '@tanstack/react-query';
import {
    fetchPosts,
    fetchPostsByMonth,
    fetchPostsByToday,
    fetchPost,
    fetchPostsByTag,
    fetchPostsBySearch,
    fetchCapoeiraSongs
} from "./api";
import {PER_PAGE} from "@/helpers/const";
import {PostsResponse, PostsByTodayResponse, SongsResponse, TransformedPost} from "@/features/posts/types";

export const usePosts = (page = 1, perPage = PER_PAGE) => {
    return useQuery<PostsResponse>({
        queryKey: ['posts', page, perPage],
        queryFn: () => fetchPosts(page, perPage),
        staleTime: 1000 * 60 * 5
    });
};

export const usePostsByMonth = (
    page = 1,
    perPage = 90,
    selectedMonth?: { start: Date; end: Date }
) => {
    return useQuery<PostsResponse>({
        queryKey: ['posts', page, perPage, selectedMonth?.start, selectedMonth?.end],
        queryFn: () => fetchPostsByMonth(page, perPage, selectedMonth),
        staleTime: 1000 * 60 * 5
    });
};

export const usePostsByToday = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDay = today.getDate(); // 1-31

    return useQuery<PostsByTodayResponse, Error>({
        queryKey: ['posts-by-today', currentMonth, currentDay],
        queryFn: () => fetchPostsByToday(currentMonth, currentDay, today),
        staleTime: 1000 * 60 * 60 * 12, // 12 часов
        gcTime: 1000 * 60 * 60 * 24,    // 24 часа (вместо cacheTime)
    });
};


export const usePost = (slug: string, options = {}) => {
    return useQuery<TransformedPost>({
        queryKey: ['post', slug],
        queryFn: () => fetchPost(slug),
        enabled: !!slug, // Запрос выполняется только если slug существует
        staleTime: 1000 * 60 * 10, // 10 минут
        ...options,
    });
};


export const usePostsByTag = (tagSlug: string, page = 1, perPage = PER_PAGE) => {
    return useQuery({
        queryKey: ['posts', 'tag', tagSlug, page, perPage],
        queryFn: () => fetchPostsByTag(tagSlug, page, perPage),
        enabled: !!tagSlug,
        staleTime: 5 * 60 * 1000,
    });
};

export const usePostsBySearch = (search: string, page = 1, perPage = PER_PAGE) => {
    return useQuery<PostsResponse>({
        queryKey: ['posts', 'search', search, page, perPage],
        queryFn: () => fetchPostsBySearch(search, page, perPage),
        enabled: !!search,
        staleTime: 1000 * 60 * 5,
    });
};

export const useCapoeiraSongsPosts = (page = 1, perPage = PER_PAGE) => {
    return useQuery<SongsResponse>({
        queryKey: ['capoeira-songs', page, perPage],
        queryFn: () => fetchCapoeiraSongs(page, perPage),
        staleTime: 1000 * 60 * 5
    });
};
