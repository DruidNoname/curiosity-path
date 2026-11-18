import {PER_PAGE} from '@/config/pagination';
import {SEARCH_URL} from './const';
import type {SearchResponse} from './types';

export const fetchSearch = async (
    query: string,
    page: number = 1,
    perPage: number = PER_PAGE,
): Promise<SearchResponse> => {
    const params = new URLSearchParams({q: query, page: String(page), per_page: String(perPage)});
    const res = await fetch(`${SEARCH_URL}?${params}`);
    if (!res.ok) throw new Error('Ошибка при поиске постов');
    return res.json();
};
