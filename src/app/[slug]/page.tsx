'use client'
import React, { Suspense } from 'react';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Button, Container, Divider, Typography} from "@mui/material";
import { usePost } from "@/lib/posts/hooks";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

interface PostProps {
    params: Promise<{ slug: string }>;
}

const Post: React.FC<PostProps> = ({ params }) => {
    const router = useRouter();
    const { slug } = React.use(params);

    const { data: post, isLoading, isError, error } = usePost(slug);

    const handleGoBack = () => {
        router.back();
    };

    if (isLoading) return <div>Загрузка постов...</div>;
    if (isError) return <div>Ошибка: {error.message}</div>;

    return (
        <ErrorBoundary componentName={'Post'}>
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                fontWeight: 'bold',
                                mb: 3
                            }}
                        >
                            {post?.title?.rendered || 'Загрузка...'}
                        </Typography>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={handleGoBack}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        >
                            Назад
                        </Button>
                    </Box>
                    <Divider sx={{ mb: 4 }} />

                    <Box sx={{ typography: 'body1' }}>
                        {post?.content?.rendered ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: post.content.rendered
                                }}
                            />
                        ) : (
                            <Typography>Загрузка контента...</Typography>
                        )}
                    </Box>
                </Box>
            </Container>
        </ErrorBoundary>
    )
}

export default Post;