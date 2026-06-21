'use client';

import React, { Suspense, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { WP_REST_API_Post } from 'wp-types';
import ErrorBoundary from "@/components/ErrorBoundary";
import { Box, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilteredTitle from "@/components/FilteredTitle";
import ResultsCount from "@/components/ResultsCount";
import { usePostsBySearch } from "@/features/posts/hooks";
import Loader from "@/ui/Loader";
import Pagination from "@/ui/Pagination";
import { PER_PAGE } from "@/helpers/const";
import { PostPreview } from "@/modules/EntryPreview/components/PostPreview";

const SearchResults: React.FC = () => {
    const searchParams = useSearchParams();
    const query = (searchParams.get('q') || '').trim();

    const [page, setPage] = useState(1);

    // Сбрасываем пагинацию при смене поискового запроса
    React.useEffect(() => {
        setPage(1);
    }, [query]);

    const {
        data,
        isLoading,
        isError,
        error,
    } = usePostsBySearch(query, page, PER_PAGE);

    const {
        posts = [],
        totalPages = 1,
    } = data || {};

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
                        <Loader size={40} />
                    </Box>
                ) : isError && posts.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography variant="h5" color="error" gutterBottom>
                            Ошибка поиска
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {error?.message || 'Не удалось загрузить результаты'}
                        </Typography>
                    </Box>
                ) : posts.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <SearchIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Ничего не найдено по запросу «{query}»
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {posts.map((post: WP_REST_API_Post) => (
                            <PostPreview
                                entryId={post.id}
                                entrySlug={`/${post.slug}`}
                                entryTitle={post.title?.rendered || 'Без названия'}
                                entryPreview={post.excerpt?.rendered || ''}
                                entryDate={post.date || ''}
                                entryTags={post.tags || []}
                                key={`post_${post.id}`}
                            />
                        ))}
                        {totalPages > 1 && (
                            <Pagination
                                sx={{ mt: 3, mb: 4 }}
                                count={totalPages}
                                page={page}
                                onChange={(_e, newPage) => {
                                    setPage(newPage);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
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
