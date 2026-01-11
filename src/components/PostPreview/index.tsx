'use client'
import React from "react";
import styles from './style.module.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import { WP_REST_API_Post } from 'wp-types';
import {Card, Typography, Link, Box} from "@mui/material";
import {createExcerpt} from "@/lib/posts/utils";

type Props = {
    post: WP_REST_API_Post
}

const PostPreview: React.FC<Props> = ({ post }) => {
    const title = post.title?.rendered || 'Без названия';
    const date = post.date ? new Date(post.date).toLocaleDateString('ru-RU') : '';
    const excerpt = createExcerpt(post.excerpt?.rendered || '');

    return (
        <ErrorBoundary componentName={'PostReview'}>
            <Card key={post.id} className={styles.PostPreview}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                <Typography variant="h5" component="h5">
                    <Link href={`/${post.slug}`}>
                    { title }
                    </Link>
                </Typography>

                { date &&
                    <time className={styles.date}>{date}</time>
                }
                </Box>

                {excerpt && (
                    <Typography
                        variant="body1"
                        component="div"
                        sx={{ mt: 5, mb: 3 }}
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                    />
                )}
            </Card>
        </ErrorBoundary>
    );
}

export default PostPreview;