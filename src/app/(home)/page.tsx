'use client'
import React from "react";
import { WP_REST_API_Post } from 'wp-types';
import PostPreview from "@/components/PostPreview";
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Divider} from "@mui/material";
import {usePosts} from "@/lib/posts/hooks";
import InfoWidget from "@/app/(home)/components/InfoWidget";

const MainPage: React.FC = () => {
    const [page, setPage] = React.useState(1);
    const perPage = 10;

    const {
        data,
        isLoading,
        isError,
        error
    } = usePosts(page, perPage);

    // Обработка загрузки
    if (isLoading) {
        return <div>Загрузка постов...</div>;
    }

    // Обработка ошибки
    if (isError) {
        return <div>Ошибка: {error?.message}</div>;
    }

    const {
        posts = [],
        total = 0,
        totalPages = 1
    } = data || {};

    return (
        <ErrorBoundary componentName={'MainPage'}>
            <Box sx={{ mb: 4 }}>
                <InfoWidget count={ total }/>

                {posts?.map((post: WP_REST_API_Post) => (
                    <PostPreview post={post} key={post.id}/>
                ))}
            </Box>
        </ErrorBoundary>
    );
}

export default MainPage;