import React from "react";
import styles from './style.module.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Paper, Box, Typography, Link} from "@mui/material";
import {createExcerpt} from "@/helpers/wp-html";
import {toPlainText} from "@/helpers/wp-text";
import {PostTag} from "@/features/posts/types";
import {EntryPreviewContent} from "../EntryPreviewContent";
import {ImageBordered} from "@/components/Images";
import Highlight from "@/ui/Highlight";
import {createSubstringMatcher, getSearchSnippets, highlightText, type Snippet, type SnippetsResult} from "@/helpers/search-snippets";
import {SearchSnippets} from "../SearchSnippets";

type Props = {
    entryId: number;
    entrySlug: string;
    entryTitle: string;
    entryPreview?: string;
    entryDate?: string;
    entryTags?: PostTag[];
    entryImage?: string | null;
    /** srcSet картинки (см. buildSrcSet в features/posts/api): без него на телефоне мыло. */
    entryImageSrcSet?: string;
    /** Запрос поиска: с ним вместо анонса — фрагменты с найденными словами, заголовок с подсветкой. */
    searchQuery?: string;
    /** Полный HTML записи (`content.rendered`) — из него режутся фрагменты для поиска. */
    entryContent?: string;
    /** Готовая подсветка заголовка от своего поиска — тогда по `searchQuery` она не считается. */
    searchTitleParts?: Snippet;
    /** Готовые фрагменты от своего поиска; `null` — фрагментов нет, показать анонс. */
    searchSnippets?: SnippetsResult | null;
}
const PostPreviewComponent: React.FC<Props> = ({ entryTitle, entryPreview, entryDate, entryTags, entryId, entrySlug, entryImage, entryImageSrcSet, searchQuery, entryContent, searchTitleParts, searchSnippets }) => {
    // Заголовок идёт в текстовый узел и в alt — нужен простой текст, не разметка.
    const title = React.useMemo(() => toPlainText(entryTitle) || 'Без названия', [entryTitle]);
    // createExcerpt запускает sanitizeHtml + DOMParser — дорого, мемоизируем по входу.
    const excerpt = React.useMemo(() => createExcerpt(entryPreview || ''), [entryPreview]);
    // Фрагменты ищем сначала в тексте, потом в анонсе: WP находит запись и по ручному анонсу.
    // Пусто — совпадение там, где его не видно (атрибут, шорткод), и остаётся обычный анонс.
    // Регекспы по всему тексту записи — тоже не бесплатно, мемоизируем по входу.
    const snippets = React.useMemo(() => {
        if (searchSnippets !== undefined) return searchSnippets;
        if (!searchQuery) return null;
        const matcher = createSubstringMatcher(searchQuery);
        const fromContent = getSearchSnippets(entryContent, matcher);
        const found = fromContent.snippets.length ? fromContent : getSearchSnippets(entryPreview, matcher);
        return found.snippets.length ? found : null;
    }, [searchSnippets, searchQuery, entryContent, entryPreview]);
    const titleParts = React.useMemo(
        () => searchTitleParts
            ?? (searchQuery ? highlightText(title, createSubstringMatcher(searchQuery)) : null),
        [searchTitleParts, title, searchQuery],
    );
    const body = snippets ? <SearchSnippets {...snippets} /> : undefined;
    const date = entryDate ? new Date(entryDate).toLocaleDateString('ru-RU') : '';

    return (
        <ErrorBoundary componentName={'PostPreview'}>
            <Paper key={entryId} className={styles.PostPreview}>
                <Box className={styles.Heading}>
                    <Typography variant="h5" component="h5" className={styles.Title}>
                        <Link href={entrySlug}>
                            { titleParts ? <Highlight parts={titleParts} /> : title }
                        </Link>
                    </Typography>
                    { date &&
                        <time className={styles.Date}>{ date || '' }</time>
                    }
                </Box>
                { entryImage ?
                    <>
                        <ImageBordered
                            src={ entryImage }
                            srcSet={ entryImageSrcSet || undefined }
                            // Ширина рамки превью: на телефоне — во всю колонку, с 600px — 210px.
                            sizes="(min-width: 600px) 210px, 100vw"
                            alt={ title }
                            classNameWrapper={styles.ImageBox}
                            className={styles.Image}
                        />
                        <Box>
                            <EntryPreviewContent
                                excerpt={body ? undefined : excerpt || undefined}
                                body={body}
                                tags={entryTags}
                            />
                        </Box>
                        <Box sx={{clear: 'both'}}></Box>
                    </>
                    :
                    <EntryPreviewContent
                        excerpt={body ? undefined : excerpt || undefined}
                        body={body}
                        tags={entryTags}
                    />
                }
            </Paper>
        </ErrorBoundary>
    );
};

export const PostPreview = React.memo(PostPreviewComponent);
