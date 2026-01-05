'use client'
import React from "react";
import styles from "./style.module.css";
import { WP_REST_API_Post } from 'wp-types';
import PostPreview from "@/components/PostPreview";
import { useQuery } from '@tanstack/react-query';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Card, Divider, Typography} from "@mui/material";
import {usePosts} from "@/lib/posts/hooks";

const MainPage: React.FC = () => {
    const { data: posts, isLoading, isError, error } = usePosts();

    if (isLoading) return <div>Загрузка постов...</div>;
    if (isError) return <div>Ошибка: {error.message}</div>;
    if (!posts?.length) return <div>Посты не найдены</div>;

    return (
        <ErrorBoundary componentName={'MainPage'}>
            <Box sx={{ mb: 4 }}>
                <Card className={styles.InfoWidget}>
                    <Box sx={{ typography: 'body1' }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{ mb: 2 }}
                        >
                            Журнал открытой миру
                        </Typography>
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{ mb: 5 }}
                        >
                            Путевые заметки мирохода Curiosity
                        </Typography>
                        <Typography
                            variant="body1"
                            component="p"
                        >
                            Здесь будет статистика (но это неточно и не скоро)
                        </Typography>
                    </Box>
                </Card>

                {posts?.map((post: WP_REST_API_Post) => (
                    <PostPreview post={post} key={post.id}/>
                ))}
                <Divider sx={{ mb: 4 }} />
                <p>Постов: {posts?.length || 0}</p>
            </Box>
        </ErrorBoundary>
    );
}

export default MainPage;