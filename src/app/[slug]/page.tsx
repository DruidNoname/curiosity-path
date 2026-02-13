'use client';
import React from 'react';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Container, Divider, Typography} from "@mui/material";
import { usePost } from "@/features/posts/hooks";
import Skeleton from "@/ui/Skeleton";
import { getCleanEntry} from "@/helpers/utils";
import EntryTitle from "../../components/SingleEntry/EntryTitle";

interface PostProps {
    params: Promise<{ slug: string }>;
}
const Post: React.FC<PostProps> = ({ params }) => {
    const { slug } = React.use(params);
    const { data: post, isLoading, isError, error } = usePost(slug);

    const title = post?.title?.rendered || 'Без названия';
    const date = post?.date ? new Date(post.date).toLocaleDateString('ru-RU') : '';
    const excerpt = getCleanEntry(post?.excerpt?.rendered || '');
    const content = getCleanEntry(post?.content.rendered || '');


    if (isError) return <div>Ошибка: {error.message}</div>;

    return (
        <ErrorBoundary componentName={'Post'}>
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 2 }}>
                    <EntryTitle title={title} isLoading={isLoading} date={date}/>
                    <Divider sx={{ marginTop: '32px', marginBottom: '32px',  }} />

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
    );
};

export default Post;