'use client'
import React from 'react';
import styles from './style.module.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Button, Container, Divider, Typography} from "@mui/material";
import { usePost } from "@/features/posts/hooks";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import Skeleton from "@/ui/Skeleton";
import { getCleanEntry} from "@/helpers/utils";

interface PostProps {
    params: Promise<{ slug: string }>;
}

const Post: React.FC<PostProps> = ({ params }) => {
    const router = useRouter();
    const { slug } = React.use(params);
    const { data: post, isLoading, isError, error } = usePost(slug);

    const title = post?.title?.rendered || 'Без названия';
    const date = post?.date ? new Date(post.date).toLocaleDateString('ru-RU') : '';
    const excerpt = getCleanEntry(post?.excerpt?.rendered || '');
    const content = getCleanEntry(post?.content.rendered || '');
    const handleGoBack = () => {
        router.back();
    };

    if (isError) return <div>Ошибка: {error.message}</div>;

    return (
        <ErrorBoundary componentName={'Post'}>
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 2 }} className={styles.Post}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                        <Box sx={{ typography: 'body1' }}>
                            <Typography
                                variant="h1"
                                component="h1"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 1
                                }}
                            >
                                { isLoading ? <Skeleton width={320}/> : title }
                            </Typography>
                            <Typography
                                variant="body1"
                                component="p"
                                dangerouslySetInnerHTML={{ __html: date }}
                            />

                        </Box>
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
                        { isLoading ?
                            <>
                                <Skeleton width={200}/><br/>
                                <Skeleton width={350}/><br/>
                                <Skeleton width={200}/><br/>
                            </>
                            :
                            <>
                                <Typography
                                    variant="body1"
                                    component="div"
                                    dangerouslySetInnerHTML={{ __html: excerpt }}
                                />
                                <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
                                <Typography
                                    variant="body1"
                                    component="div"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
                            </>
                        }
                    </Box>
                </Box>
            </Container>
        </ErrorBoundary>
    )
}

export default Post;