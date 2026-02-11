import React from "react";
import styles from './style.module.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import { WP_REST_API_Post } from 'wp-types';
import {Card, Typography, Link, Box} from "@mui/material";
import {createExcerpt} from "@/helpers/utils";
import {TAGS_URL} from "@/features/tags/const";
import {useQueries} from "@tanstack/react-query";

type Props = {
    post: WP_REST_API_Post
}
const PostPreview: React.FC<Props> = ({ post }) => {
    const title = post.title?.rendered || 'Без названия';
    const date = post.date ? new Date(post.date).toLocaleDateString('ru-RU') : '';
    const excerpt = createExcerpt(post.excerpt?.rendered || '');
    const tagIds = post.tags || [];

    const tagQueries = useQueries({
        queries: tagIds.map(id => ({
            queryKey: ['tag', 'id', id],
            queryFn: async () => {
                const res = await fetch(`${TAGS_URL}/${id}`);
                if (!res.ok) throw new Error('Ошибка при получении данных о теге');
                return await res.json();
            },
            enabled: !!id,
            staleTime: 1000 * 60 * 5
        }))
    });

    // Extract data from all queries
    const tags = tagQueries.map(query => query.data).filter(Boolean);
    const isLoading = tagQueries.some(query => query.isLoading);
    const isError = tagQueries.some(query => query.isError);

    return (
        <ErrorBoundary componentName={'PostReview'}>
            <Card key={post.id} className={styles.PostPreview}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h5" sx={{ mb: 1 }}>
                        <Link href={`/${post.slug}`}>
                            { title }
                        </Link>
                    </Typography>
                    { date &&
                        <time className={styles.date}>{date}</time>
                    }
                </Box>

                {excerpt &&
                    <Typography
                        variant="body1"
                        component="div"
                        sx={{ mb: 3 }}
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                    />
                }

                { tags.length > 0 &&
                    <Typography variant="body2" component="div">
                        Теги: {tags.reduce((acc, tag, index) => {
                        const tagElement = (
                            <span key={tag.id}>
                <Link
                    href={tag.slug ? `/tag/${tag.slug}` : tag.link}
                    className="inline-block px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                >
                    {tag.name}
                </Link>
            </span>
                        );

                        if (index === 0) return [tagElement];
                        return [...acc, ', ', tagElement];
                    }, [])}
                    </Typography>
                }
            </Card>
        </ErrorBoundary>
    );
};

export default PostPreview;