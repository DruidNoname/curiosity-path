'use client';

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { WP_REST_API_Post, WP_REST_API_Tag } from 'wp-types';
import PostPreview from "@/components/PostPreview";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Box, Divider, Typography, Chip, Breadcrumbs } from "@mui/material";
import { usePostsByTag } from "@/features/posts/hooks";
import InfoWidget from "@/app/(home)/components/InfoWidget";
import Loader from "@/ui/Loader";
import Pagination from "@/ui/Pagination";
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import TagIcon from '@mui/icons-material/Tag';
import { PER_PAGE } from "@/features/posts/const";
import {useTag} from "@/features/tags/hooks";

const TagPage: React.FC = () => {
    const params = useParams();
    const slug = params?.slug as string;

    const [page, setPage] = useState(1);

    const {
        data: tagData,
        isLoading,
        isError,
        error
    } = useTag(slug);

    const {
        data: postsData,
        isLoading: isPostsLoading,
        isError: isPostsError,
        error: postsError
    } = usePostsByTag(slug, page, PER_PAGE);

    const {
        posts = [],
        total = 0,
        totalPages = 1
    } = postsData || {};

    if (isLoading && page === 1) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Loader />
            </Box>
        );
    }

    if (isError && !posts.length) {
        return (
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Ошибка загрузки тега
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {error?.message || 'Не удалось загрузить данные'}
                </Typography>
            </Box>
        );
    }

    console.log(tagData);

    return (
        <ErrorBoundary componentName={'TagPage'}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ mb: 4, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Chip
                            icon={<TagIcon />}
                            label="Тег"
                            color="primary"
                            size="small"
                        />
                        <Typography variant="h4" component="h1">
                            {tagData?.name || decodeURIComponent(slug)}
                        </Typography>
                    </Box>

                    {tagData?.description && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 1, mb: 2 }}
                        >
                            {tagData?.description}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            ID: {tagData?.id || '—'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Постов: {total}
                        </Typography>
                        {tagData?.count && (
                            <Typography variant="body2" color="text.secondary">
                                Всего в базе: {tagData.count}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Виджет с информацией */}
                {/*<InfoWidget*/}
                {/*    count={total}*/}
                {/*    isLoading={isLoading}*/}
                {/*    isError={isError}*/}
                {/*    customText={`постов с тегом "${name || decodeURIComponent(slug)}"`}*/}
                {/*/>*/}

                {/* Загрузка при пагинации */}
                {isLoading && page > 1 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <Loader size={40} />
                    </Box>
                ) : (
                    <>
                        {/* Список постов */}
                        {posts?.map((post: WP_REST_API_Post) => (
                            <PostPreview post={post} key={post.id} />
                        ))}

                        {/* Пагинация */}
                        {totalPages > 1 && (
                            <Pagination
                                sx={{ mt: 3, mb: 4 }}
                                count={totalPages}
                                page={page}
                                onChange={(_e, newPage) => {
                                    setPage(newPage);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={isLoading}
                            />
                        )}

                        {/* Сообщение если нет постов */}
                        {!isLoading && posts.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <TagIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Пока нет постов с этим тегом
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Но вы можете быть первым!
                                </Typography>
                            </Box>
                        )}
                    </>
                )}

                {/* Ошибка */}
                {isError && posts.length === 0 && (
                    <>
                        <Typography variant="body1" component="p">
                            Не удалось загрузить посты тега.
                        </Typography>
                        <Divider sx={{ mx: 4, my: 2 }} />
                        <Typography variant="body2" component="p">
                            Ошибка: {error?.message}
                        </Typography>
                    </>
                )}
            </Box>
        </ErrorBoundary>
    );
}

export default TagPage;