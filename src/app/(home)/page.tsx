'use client'
import React from "react";
import { WP_REST_API_Post } from 'wp-types';
import PostPreview from "@/components/PostPreview";
import { useQuery } from '@tanstack/react-query';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Divider} from "@mui/material";

const MainPage: React.FC = () => {

    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery<WP_REST_API_Post[], Error>({
        queryKey: ['posts', 'main', 5],
        queryFn: async () => {
            const response = await fetch('http://localhost:8000/wp-json/wp/v2/posts?per_page=3');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
    });

    if (isLoading) return <div>Загрузка...</div>;
    if (isError) return <div>Ошибка: {error.message}</div>;

    return (
        <ErrorBoundary componentName={'MainPage'}>
            <Box sx={{ mb: 4 }}>

                {data?.map((post: WP_REST_API_Post) => (
                    <PostPreview post={post} key={post.id}/>
                ))}
                <Divider sx={{ mb: 4 }} />
                <p>Постов: {data?.length || 0}</p>
            </Box>
        </ErrorBoundary>
    );
}

export default MainPage;