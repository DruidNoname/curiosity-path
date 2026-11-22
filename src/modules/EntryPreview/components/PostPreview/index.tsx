import React from "react";
import styles from './style.module.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Paper, Box, Typography, Link} from "@mui/material";
import {toPlainText} from "@/helpers/wp-text";
import {PostTag} from "@/features/posts/types";
import {EntryPreviewContent} from "../EntryPreviewContent";
import {ImageBordered} from "@/components/Images";
import Highlight from "@/ui/Highlight";
import {createSubstringMatcher, createWordsMatcher, getSearchSnippets, highlightText, SnippetsResult} from "@/helpers/search-snippets";
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
    /**
     * Запрос поиска WP: с ним вместо анонса — фрагменты с найденными словами, заголовок
     * с подсветкой. Совпадение — подстрока, как ищет сам WP.
     */
    searchQuery?: string;
    /**
     * Словоформы от плагина поиска (`matchedWords`): подсвечиваются только они, целыми
     * словами. Если заданы, `searchQuery` не нужен.
     */
    searchWords?: string[];
    /** Полный HTML записи (`content.rendered`) — из него режутся фрагменты для поиска. */
    entryContent?: string;
    /**
     * Готовые фрагменты от плагина поиска: клиент их не считает, только выводит.
     * Пустой список — анонс. Если передан, `entryContent` и поиск по тексту не нужны.
     */
    searchSnippets?: SnippetsResult;
}
const PostPreviewComponent: React.FC<Props> = ({ entryTitle, entryPreview, entryDate, entryTags, entryId, entrySlug, entryImage, entryImageSrcSet, searchQuery, searchWords, entryContent, searchSnippets }) => {
    // Заголовок идёт в текстовый узел и в alt — нужен простой текст, не разметка.
    const title = React.useMemo(() => toPlainText(entryTitle) || 'Без названия', [entryTitle]);
    // Фрагменты ищем сначала в тексте, потом в анонсе: WP находит запись и по ручному анонсу.
    // Пусто — совпадение там, где его не видно (атрибут, шорткод), и остаётся обычный анонс.
    // Регекспы по всему тексту записи — тоже не бесплатно, мемоизируем по входу.
    const matcher = React.useMemo(
        () => (searchWords ? createWordsMatcher(searchWords) : searchQuery ? createSubstringMatcher(searchQuery) : null),
        [searchWords, searchQuery],
    );
    const snippets = React.useMemo(() => {
        if (searchSnippets) return searchSnippets.snippets.length ? searchSnippets : null;
        if (!matcher) return null;
        const fromContent = getSearchSnippets(entryContent, matcher);
        const found = fromContent.snippets.length ? fromContent : getSearchSnippets(entryPreview, matcher);
        return found.snippets.length ? found : null;
    }, [matcher, entryContent, entryPreview, searchSnippets]);
    const titleParts = React.useMemo(
        () => (matcher ? highlightText(title, matcher) : null),
        [matcher, title],
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
                                excerpt={body ? undefined : entryPreview}
                                body={body}
                                tags={entryTags}
                            />
                        </Box>
                        <Box sx={{clear: 'both'}}></Box>
                    </>
                    :
                    <EntryPreviewContent
                        excerpt={body ? undefined : entryPreview}
                        body={body}
                        tags={entryTags}
                    />
                }
            </Paper>
        </ErrorBoundary>
    );
};

export const PostPreview = React.memo(PostPreviewComponent);
