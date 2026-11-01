import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { fetchPost } from '@/features/posts/api';

// cache: generateMetadata и сама страница спрашивают одну и ту же запись — запрос один.
const getPost = cache(fetchPost);
import { toPlainText, toMetaText } from '@/helpers/wp-text';
import { urls } from '@/config/urls';
import PostView from './PostView';

interface Props {
    params: Promise<{ slug: string }>;
}

/**
 * Серверная обёртка над клиентской страницей поста.
 *
 * Нужна ради двух вещей, которые клиентской странице недоступны: метаданных
 * (`generateMetadata` нельзя экспортировать из файла с `'use client'`, а превью
 * ссылок в мессенджерах строится по HTML без выполнения JS) и статуса 404 для
 * несуществующей записи. Сама отрисовка осталась клиентской — данные по-прежнему
 * тянет React Query в браузере.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const post = await getPost(slug);
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

    // Есть ли запись, проверяем на сервере: только так несуществующий адрес получает
    // статус 404, а не 200 со страницей-ошибкой. Если WordPress не ответил, 404 не
    // отдаём — клиентская часть сама попробует загрузить и покажет ошибку.
    // notFound() бросает исключение, поэтому стоит вне try.
    let exists = true;
    try {
        exists = (await getPost(slug)) !== null;
    } catch {
        // недоступность WordPress — не повод для 404
    }
    if (!exists) notFound();

    return <PostView slug={slug} />;
}
