import type {PostTag} from '@/features/posts/types';
import type {Snippet, SnippetsResult} from '@/helpers/search-snippets';

/** Запись в выдаче поиска: всё, что нужно превью, плюс готовая подсветка. */
export interface SearchHit {
    id: number;
    slug: string;
    date: string;
    /** Заголовок простым текстом. */
    title: string;
    /** Заголовок, порезанный на совпадения. */
    titleParts: Snippet;
    /** HTML анонса — запасной вариант, если фрагментов с совпадениями нет. */
    excerpt: string;
    postTags: PostTag[];
    /** `null` — совпадение только в заголовке или невидимой части записи. */
    snippets: SnippetsResult | null;
}

/** Контракт списка — тот же, что у всех api-функций. */
export interface SearchResponse {
    posts: SearchHit[];
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
}
