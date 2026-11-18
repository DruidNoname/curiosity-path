import {useQuery} from '@tanstack/react-query';
import {PER_PAGE} from '@/config/pagination';
import {fetchSearch} from './api';
import {SEARCH_STALE_TIME} from './const';
import type {SearchResponse} from './types';

/** Поиск по словоформам через свой индекс. Пустой запрос не отправляется. */
export const useSearch = (query: string, page = 1, perPage = PER_PAGE, enabled = true) =>
    useQuery<SearchResponse>({
        queryKey: ['search', query, page, perPage],
        queryFn: () => fetchSearch(query, page, perPage),
        enabled: enabled && !!query,
        staleTime: SEARCH_STALE_TIME,
    });
