import React from "react";
import styles from './style.module.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Paper, Typography, Link, Box} from "@mui/material";
import {createExcerpt} from "@/helpers/utils";
import {TAGS_URL} from "@/features/tags/const";
import {useQueries} from "@tanstack/react-query";

type Props = {
    entryId: string;
    entrySlug: string;
    entryTitle: string;
    entryPreview: string;
    entryDate?: string;
    entryTags?: number[];
}
const EntryPreview: React.FC<Props> = ({ entryTitle, entryPreview, entryDate, entryTags, entryId, entrySlug  }) => {
    const title = entryTitle || 'Без названия';
    const date = entryDate ? new Date(entryDate).toLocaleDateString('ru-RU') : '';
    const excerpt = createExcerpt(entryPreview || '');
    const tagIds = entryTags || [];

    // const title = post.title?.rendered || 'Без названия';
    // const date = post.date ? new Date(post.date).toLocaleDateString('ru-RU') : '';
    // const excerpt = createExcerpt(post.excerpt?.rendered || '');
    // const tagIds = tags || [];

//toDo вынести получение тегов куда-нибудь в отдельное

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
//toDo вынести получение тегов куда-нибудь в отдельное

    return (
        <ErrorBoundary componentName={'EntryPreview'}>
            <Paper key={entryId} className={styles.PostPreview}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h5" sx={{ mb: 1 }}>
                        <Link href={`/${entrySlug}`}>
                            { title }
                        </Link>
                    </Typography>
                    { date &&
                        <time className={styles.date}>{date}</time>
                    }
                </Box>//
                { excerpt &&
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
            </Paper>
        </ErrorBoundary>
    );
};

export default EntryPreview;