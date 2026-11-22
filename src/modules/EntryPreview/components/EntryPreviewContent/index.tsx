import {Box, Link, Typography} from "@mui/material";
import styles from "@/modules/EntryPreview/components/PostPreview/style.module.css";
import React from "react";
import {PostTag} from "@/features/posts/types";
import WpHtml from "@/ui/WpHtml";

interface Props {
    title?: string;
    link?: string;
    date?: string;
    /** Сырой анонс из WP: очистку и обрезку делает WpHtml. */
    excerpt?: string;
    /** Готовое содержимое вместо анонса (например, фрагменты поиска). */
    body?: React.ReactNode;
    tags?: PostTag[];
}

export const EntryPreviewContent: React.FC<Props> = ({title, link, date, excerpt, body, tags}) => {
    return(
        <>
            { title &&
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h5" component="h5" sx={{ mb: 1 }}>
                        <Link href={link}>
                            { title }
                        </Link>
                    </Typography>
                    { date &&
                        <time className={styles.Date}>{date}</time>
                    }
                </Box>
            }
            <WpHtml html={excerpt} prepare="excerpt" variant="body1" />
            { body }
            {tags && tags.length > 0 && (
                <Typography variant="body2" component="div">
                    Теги: {
                        tags.reduce((acc: React.ReactNode[], tag: PostTag, index: number) => {
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
                        }, [])
                }
                </Typography>
            )}
        </>
    );
};