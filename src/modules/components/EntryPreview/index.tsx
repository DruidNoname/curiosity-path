import React from "react";
import styles from './style.module.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Paper, Box} from "@mui/material";
import {createExcerpt} from "@/helpers/utils";
import {useTagsByIds} from "@/features/tags/hooks";
import {EntryPreviewContent} from "@/modules/components/EntryPreviewContent";
import {ImageBordered} from "@/components/Images";

type Props = {
    entryId: number;
    entrySlug: string;
    entryTitle: string;
    entryPreview?: string;
    entryDate?: string;
    entryTags?: number[];
    entryImage?: string;
}
export const EntryPreview: React.FC<Props> = ({ entryTitle, entryPreview, entryDate, entryTags, entryId, entrySlug, entryImage }) => {
    const title = entryTitle || 'Без названия';
    const date = entryDate ? new Date(entryDate).toLocaleDateString('ru-RU') : '';
    const excerpt = createExcerpt(entryPreview || '');
    const tagIds = entryTags || [];

    const { tags, isLoading } = useTagsByIds(tagIds);

    return (
        <ErrorBoundary componentName={'EntryPreview'}>
            <Paper key={entryId} className={styles.EntryPreview}>
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
