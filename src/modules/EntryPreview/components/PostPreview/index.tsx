import React from "react";
import styles from './style.module.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Paper, Box, Typography, Link} from "@mui/material";
import {createExcerpt, getCleanEntry} from "@/helpers/utils";
import {useTagsByIds} from "@/features/tags/hooks";
import {EntryPreviewContent} from "../EntryPreviewContent";
import {ImageBordered} from "@/components/Images";

type Props = {
    entryId: number;
    entrySlug: string;
    entryTitle: string;
    entryPreview?: string;
    entryDate?: string;
    entryTags?: number[];
    entryImage?: string | null;
}
export const PostPreview: React.FC<Props> = ({ entryTitle, entryPreview, entryDate, entryTags, entryId, entrySlug, entryImage }) => {
    const title = getCleanEntry(entryTitle) || 'Без названия';
    const date = entryDate ? new Date(entryDate).toLocaleDateString('ru-RU') : '';
    const excerpt = createExcerpt(entryPreview || '');
    const tagIds = entryTags || [];

    const { tags, isLoading } = useTagsByIds(tagIds);

    return (
        <ErrorBoundary componentName={'PostPreview'}>
            <Paper key={entryId} className={styles.PostPreview}>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h5" component="h5" sx={{ mb: 1 }}>
                        <Link href={entrySlug}>
                            { title }
                        </Link>
                    </Typography>
                    { date &&
                        <time className={styles.Date}>{ date || '' }</time>
                    }
                </Box>
                { entryImage ?
                    <>
                        <ImageBordered src={ entryImage } alt={ entryTitle } classNameWrapper={styles.ImageBox}/>
                        <Box>
                            <EntryPreviewContent
                                excerpt={excerpt || undefined}
                                tags={tags || undefined}
                                tagsAreLoading={isLoading}
                            />
                        </Box>
                        <Box sx={{clear: 'both'}}></Box>
                    </>
                    :
                    <EntryPreviewContent
                        excerpt={excerpt || undefined}
                        tags={tags || undefined}
                        tagsAreLoading={isLoading || undefined}
                    />
                }
            </Paper>
        </ErrorBoundary>
    );
};
