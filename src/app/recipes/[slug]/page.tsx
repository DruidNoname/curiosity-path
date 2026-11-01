import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { fetchRecipeBySlug } from '@/features/recipes/api';

// cache: generateMetadata и сама страница спрашивают одну и ту же запись — запрос один.
const getRecipe = cache(fetchRecipeBySlug);
import { toPlainText, toMetaText } from '@/helpers/wp-text';
import { urls } from '@/config/urls';
import RecipeView from './RecipeView';

interface Props {
    params: Promise<{ slug: string }>;
}

/**
 * Серверная обёртка над клиентской страницей рецепта — ради метаданных и статуса
 * 404, см. комментарий в src/app/[slug]/page.tsx.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const item = await getRecipe(slug);
        const title = toPlainText(item?.title?.rendered) || toPlainText(item?.recipe?.name);
        if (!title) return {};

        const description = toMetaText(item?.recipe?.summary || item?.content?.rendered);
        const image = item?.recipe?.image_url || undefined;

        return {
            title,
            description: description || undefined,
            openGraph: {
                type: 'article',
                title,
                description: description || undefined,
                url: `${urls.base}/recipes/${slug}`,
                images: image ? [{ url: image, alt: title }] : undefined,
            },
            twitter: {
                card: image ? 'summary_large_image' : 'summary',
                title,
                description: description || undefined,
            },
        };
    } catch {
        return {};
    }
}

export default async function RecipePage({ params }: Props) {
    const { slug } = await params;

    // Есть ли запись, проверяем на сервере: только так несуществующий адрес получает
    // статус 404, а не 200 со страницей-ошибкой. Если WordPress не ответил, 404 не
    // отдаём — клиентская часть сама попробует загрузить и покажет ошибку.
    // notFound() бросает исключение, поэтому стоит вне try.
    let exists = true;
    try {
        exists = (await getRecipe(slug)) !== null;
    } catch {
        // недоступность WordPress — не повод для 404
    }
    if (!exists) notFound();

    return <RecipeView slug={slug} />;
}
