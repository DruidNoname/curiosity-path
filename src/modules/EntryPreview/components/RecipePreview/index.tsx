import React from "react";
import styles from './style.module.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Paper, Box, Typography, Link, Skeleton} from "@mui/material";
import {createExcerpt, getCleanEntry} from "@/helpers/utils";
import {EntryPreviewContent} from "../EntryPreviewContent";
import {ImageBordered} from "@/components/Images";
import {useKeywords} from "@/features/recipes/hooks";

type Props = {
    entryId: number;
    entrySlug: string;
    entryTitle: string;
    entryPreview?: string;
    entryDate?: string;
    entryTags?: number[];
    entryImage?: string | null;
    isRecipe?: boolean;
}
export const RecipePreview: React.FC<Props> = ({ entryTitle, entryPreview, entryDate, entryTags, entryId, entrySlug, entryImage, isRecipe }) => {
    const title = getCleanEntry(entryTitle) || 'Без названия';
    const date = entryDate ? new Date(entryDate).toLocaleDateString('ru-RU') : '';
    const excerpt = createExcerpt(entryPreview || '');

    const { data: allKeywords, isLoading: keywordsLoading } = useKeywords();
    const keywords = allKeywords?.filter(k => entryTags?.includes(k.id)) ?? [];

    return (
        <ErrorBoundary componentName={'RecipePreview'}>
            <Paper key={entryId} className={styles.RecipePreview}>
                { entryImage ?
                    <>
                        <ImageBordered src={ entryImage } alt={ entryTitle } classNameWrapper={styles.ImageBox}/>
                        <Box>
                            <EntryPreviewContent
                                title={title}
                                link={entrySlug}
                                date={date || undefined}
                                excerpt={excerpt || undefined}
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
                    />
                }
                { entryTags && entryTags.length > 0 &&
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {'Ключевые слова: '}
                        { keywordsLoading
                            ? <Skeleton variant="text" width={160} sx={{ display: 'inline-block' }} />
                            : keywords.map((kw, i) => (
                                <React.Fragment key={kw.id}>
                                    { i > 0 && ', '}
                                    <Link href={`/recipes/keywords/${kw.slug}`}>{kw.name}</Link>
                                </React.Fragment>
                            ))
                        }
                    </Typography>
                }
            </Paper>
        </ErrorBoundary>
    );
};
