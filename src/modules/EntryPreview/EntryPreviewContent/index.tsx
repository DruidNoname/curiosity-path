import {Box, Link, Typography} from "@mui/material";
import styles from "@/modules/EntryPreview/style.module.css";
import React from "react";
import {WP_REST_API_Tag} from "wp-types";
import Skeleton from "@/ui/Skeleton";

interface Props {
    title: string;
    link: string;
    date?: string;
    excerpt?: string;
    tags?: WP_REST_API_Tag[];
    tagsAreLoading?: boolean;
}

export const EntryPreviewContent: React.FC<Props> = ({title, link, date, excerpt, tags, tagsAreLoading}) => {
    return(
        <>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" component="h5" sx={{ mb: 1 }}>
                    <Link href={link}>
                        { title }
                    </Link>
                </Typography>
                { date &&
                    <time className={styles.date}>{date}</time>
                }
            </Box>
            { excerpt &&
                <Typography
                    variant="body1"
                    component="div"
                    dangerouslySetInnerHTML={{ __html: excerpt }}
                />
            }

            {tags && tags.length > 0 && (
                <Typography variant="body2" component="div">
                    Теги: {
                    tagsAreLoading ?
                    <Skeleton width={300}/>
                    :
                    tags.reduce((acc: React.ReactNode[], tag: WP_REST_API_Tag, index: number) => {
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