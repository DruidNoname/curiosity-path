'use client';

import React, { Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { PostWithTags } from "@/features/posts/types";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Box, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilteredTitle from "@/components/FilteredTitle";
import ResultsCount from "@/components/ResultsCount";
import { usePostsBySearch } from "@/features/posts/hooks";
import Loader from "@/ui/Loader";
import Pagination from "@/ui/Pagination";
import { PER_PAGE } from "@/config/pagination";
import { PostPreview } from "@/modules/EntryPreview/components/PostPreview";
import { usePageParam } from "@/helpers/usePageParam";
import { useSearch } from "@/features/search/hooks";

const SearchResults: React.FC = () => {
    const searchParams = useSearchParams();
    const query = (searchParams.get('q') || '').trim();

    // Прототип: по умолчанию — свой поиск по словоформам, `&engine=wp` — поиск WP,
    // чтобы сравнить выдачу на одном и том же запросе.
    const useWp = searchParams.get('engine') === 'wp';

    const { page, setPage } = usePageParam();

    const own = useSearch(query, page, PER_PAGE, !useWp);
    const wp = usePostsBySearch(useWp ? query : '', page, PER_PAGE);
    const { data, isLoading, isError, error } = useWp ? wp : own;

    const totalPages = data?.totalPages ?? 1;
    const hasPosts = Boolean(data?.posts.length);

    return (
        <ErrorBoundary componentName={'SearchPage'}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ mb: 4, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <FilteredTitle
                        icon={<SearchIcon />}
                        label="Поиск"
                        title={query || 'Введите запрос'}
                    />
                    <ResultsCount key={query} label="Найдено" count={data?.total} />
                </Box>

                {!query ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <SearchIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Введите запрос, чтобы найти посты
                        </Typography>
                    </Box>
                ) : isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        {/* Над результатами — заголовок поиска и счётчик. */}
                        <Loader inFlow />
                    </Box>
                ) : isError && !hasPosts ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography variant="h5" color="error" gutterBottom>
                            Ошибка поиска
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {error?.message || 'Не удалось загрузить результаты'}
                        </Typography>
                    </Box>
                ) : !hasPosts ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <SearchIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Ничего не найдено по запросу «{query}»
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {useWp
                            ? wp.data?.posts.map((post: PostWithTags) => (
                                <PostPreview
                                    entryId={post.id}
                                    entrySlug={`/${post.slug}`}
                                    entryTitle={post.title?.rendered || 'Без названия'}
                                    entryPreview={post.excerpt?.rendered || ''}
                                    entryContent={post.content?.rendered || ''}
                                    searchQuery={query}
                                    entryDate={post.date || ''}
                                    entryTags={post.postTags}
                                    key={`post_${post.id}`}
                                />
                            ))
                            : own.data?.posts.map((hit) => (
                                <PostPreview
                                    entryId={hit.id}
                                    entrySlug={`/${hit.slug}`}
                                    entryTitle={hit.title || 'Без названия'}
                                    entryPreview={hit.excerpt}
                                    searchTitleParts={hit.titleParts}
                                    searchSnippets={hit.snippets}
                                    entryDate={hit.date}
                                    entryTags={hit.postTags}
                                    key={`post_${hit.id}`}
                                />
                            ))}
                        {totalPages > 1 && (
                            <Pagination
                                sx={{ mt: 3, mb: 4 }}
                                count={totalPages}
                                page={Math.min(page, totalPages)}
                                onChange={(_e, nextPage) => setPage(nextPage)}
                            />
                        )}
                    </>
                )}
            </Box>
        </ErrorBoundary>
    );
};

const SearchPage: React.FC = () => {
    return (
        <Suspense
            fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Loader />
                </Box>
            }
        >
            <SearchResults />
        </Suspense>
    );
};

export default SearchPage;
