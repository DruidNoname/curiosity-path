import type {PostTag} from '@/features/posts/types';

/**
 * Запись в выдаче плагина поиска — в форме стандартного REST WP (`title.rendered`…),
 * чтобы превью принимало её так же, как запись из `/wp/v2/posts`.
 */
export interface SearchPost {
    id: number;
    slug: string;
    date: string;
    link: string;
    title: {rendered: string};
    excerpt: {rendered: string};
    content: {rendered: string};
    postTags: PostTag[];
    /** Словоформы, по которым запись нашлась («лесу», «лесом») — их и подсвечиваем. */
    matchedWords: string[];
}

/** Контракт списка — тот же, что у всех api-функций. */
export interface SearchResponse {
    posts: SearchPost[];
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
}
