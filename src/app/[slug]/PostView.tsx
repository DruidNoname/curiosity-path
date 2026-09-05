'use client';

import React from 'react';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Container, Divider, Typography} from "@mui/material";
import { usePost } from "@/features/posts/hooks";
import Skeleton from "@/ui/Skeleton";
import { getCleanEntry} from "@/helpers/wp-html";
import { toPlainText } from "@/helpers/wp-text";
import SingleEntryTitle from "@/components/SingleEntry/SingleEntryTitle";
import {Excerpt} from "@/app/[slug]/components/excerpt";

interface PostProps {
    slug: string;
}
const Post: React.FC<PostProps> = ({ slug }) => {
    const { data: post, isLoading, isError, error } = usePost(slug);

    // Заголовок рендерится текстом (в SingleEntryTitle и в alt картинки), разметка в нём
    // не нужна — хватает toPlainText. Анонс и тело идут в разметку, там getCleanEntry:
    // он запускает sanitizeHtml + DOMParser, это дорого, поэтому мемоизируем по входному HTML.
    const title = React.useMemo(() => toPlainText(post?.title?.rendered) || 'Без названия', [post?.title?.rendered]);
    const date = post?.date ? new Date(post.date).toLocaleDateString('ru-RU') : '';
    const excerpt = React.useMemo(() => getCleanEntry(post?.excerpt?.rendered || ''), [post?.excerpt?.rendered]);
    const content = React.useMemo(() => getCleanEntry(post?.content?.rendered || ''), [post?.content?.rendered]);
    const featuredImage = post?.featuredImageUrl;

    if (isError) return <div>Ошибка: {error.message}</div>;

    return (
        <ErrorBoundary componentName={'Post'}>
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 2 }}>
                    <SingleEntryTitle title={title} isLoading={isLoading} date={date}/>
                    <Divider sx={{ marginTop: '32px', marginBottom: '32px',  }} />

                    <Box sx={{ typography: 'body1' }}>
                        { isLoading ?
                            <>
                                <Skeleton width={180}/><br/>
                                <Skeleton width={320}/><br/>
                                <Skeleton width={180}/><br/>
                            </>
                            :
                            <>
                                <Excerpt excerpt={excerpt} title={title} image={featuredImage || undefined}/>
                                <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
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