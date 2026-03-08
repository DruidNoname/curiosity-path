import React from "react";
import styles from './style.module.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Paper, Box} from "@mui/material";
import {createExcerpt, getCleanEntry} from "@/helpers/utils";
import {useTagsByIds} from "@/features/tags/hooks";
import {EntryPreviewContent} from "./EntryPreviewContent";
import {ImageBordered} from "@/components/Images";

type Props = {
    entryId: number;
    entrySlug: string;
    entryTitle: string;
    entryPreview?: string;
    entryDate?: string;
    entryTags?: number[];
    entryImage?: string | null;
    isSeparated?: boolean;
}
export const EntryPreview: React.FC<Props> = ({ entryTitle, entryPreview, entryDate, entryTags, entryId, entrySlug, entryImage, isSeparated }) => {
    const title = getCleanEntry(entryTitle) || 'Без названия';
    const date = entryDate ? new Date(entryDate).toLocaleDateString('ru-RU') : '';
    const excerpt = createExcerpt(entryPreview || '');
    const tagIds = entryTags || [];

    const { tags, isLoading } = useTagsByIds(tagIds);

    const classes = isSeparated ? [styles.EntryPreview, styles.EntryPreviewSeparated].join(' ') : styles.EntryPreview;

    return (
        <ErrorBoundary componentName={'EntryPreview'}>
            <Paper key={entryId} className={classes}>
                { entryImage ?
                    <>
                        <ImageBordered src={ entryImage } alt={ entryTitle } classNameWrapper={styles.ImageBox}/>
                        <Box>
                            <EntryPreviewContent
                                title={title}
                                link={entrySlug}
                                date={date || undefined}
                                excerpt={excerpt || undefined}
                                tags={tags || undefined}
                                tagsAreLoading={isLoading}
                            />
                        </Box>
                        <Box sx={{clear: 'both'}}></Box>
                    </>
                    :
                    <EntryPreviewContent
                        title={title}
                        link={entrySlug}
                        date={date || undefined}
                        excerpt={excerpt || undefined}
                        tags={tags || undefined}
                        tagsAreLoading={isLoading || undefined}
                    />
                }
            </Paper>
        </ErrorBoundary>
    );
};
