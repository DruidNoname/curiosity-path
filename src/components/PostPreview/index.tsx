'use client'
import React from "react";
import styles from './style.module.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import { WP_REST_API_Post } from 'wp-types';
import {Card, Typography, Link} from "@mui/material";
import sanitizeHtml from 'sanitize-html';

type Props = {
    post: WP_REST_API_Post
}

const PostPreview: React.FC<Props> = ({ post }) => {
    // Безопасное получение данных
    const title = post.title?.rendered || 'Без названия';
    const date = post.date ? new Date(post.date).toLocaleDateString() : '';

    const getCleanExcerpt = (html: string, maxLength = 150): string => {
        if (!html) return '';

        // Шаг 1: Заменяем структурные теги на маркеры перед санитизацией
        const withMarkers = html
            .replace(/<\/p>/gi, '[[PARAGRAPH]]')
            .replace(/<br\s*\/?>/gi, '[[LINEBREAK]]');

        // Шаг 2: Полностью очищаем от HTML
        const clean = sanitizeHtml(withMarkers, {
            allowedTags: [],
            allowedAttributes: {}
        });

        // Шаг 3: Восстанавливаем структуру
        const structured = clean
            .replace(/\[\[PARAGRAPH\]\]/g, '\n\n')
            .replace(/\[\[LINEBREAK\]\]/g, '\n')
            .replace(/\s+/g, ' ')
            .replace(/\n\s+/g, '\n')
            .trim();

        // Шаг 4: Обрезаем
        return structured.length > maxLength
            ? structured.substring(0, maxLength).replace(/\s+\S*$/, '...')
            : structured;
    };
    const excerpt = getCleanExcerpt(post.excerpt?.rendered || '', 350);

    return (
        <ErrorBoundary componentName={'PostReview'}>
            <Card key={post.id} className={styles.PostPreview}>
                <Typography variant="h5" component="h5">
                    <Link href={post.slug}>
                    { title }
                    </Link>
                </Typography>

                { date &&
                    <time className={styles.date}>{date}</time>
                }

                {excerpt && (
                    <Typography variant="body1" component="p" sx={{ mt: 5, mb: 3 }}>
                        {  excerpt }
                    </Typography>
                )}
                <Link className={styles.ButtonLink} href={post.slug}>
                    Читать далее
                </Link>
            </Card>
        </ErrorBoundary>
    );
}

export default PostPreview;