import type { Metadata } from 'next';
import { fetchPost } from '@/features/posts/api';
import { toPlainText, toMetaText } from '@/helpers/wp-text';
import { urls } from '@/config/urls';
import PostView from './PostView';

interface Props {
    params: Promise<{ slug: string }>;
}

/**
 * Серверная обёртка над клиентской страницей поста.
 *
 * Нужна только ради метаданных: `generateMetadata` нельзя экспортировать из файла
 * с `'use client'`, а превью ссылок в мессенджерах строится по HTML без выполнения
 * JS. Сама отрисовка осталась прежней, клиентской, — данные по-прежнему тянет
 * React Query в браузере.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const post = await fetchPost(slug);
        const title = toPlainText(post?.title?.rendered);
        if (!title) return {};

        const description = toMetaText(post?.excerpt?.rendered);
        const image = post?.featuredImageUrl || undefined;

        return {
            title,
            description: description || undefined,
            openGraph: {
                type: 'article',
                title,
                description: description || undefined,
                url: `${urls.base}/${slug}`,
                publishedTime: post?.date,
                images: image ? [{ url: image, alt: title }] : undefined,
            },
            twitter: {
                card: image ? 'summary_large_image' : 'summary',
                title,
                description: description || undefined,
            },
        };
    } catch {
        // Метаданные — не повод ронять страницу: если WordPress недоступен или
        // поста нет, отдаём дефолты из корневого layout.
        return {};
    }
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;

    return <PostView slug={slug} />;
}
