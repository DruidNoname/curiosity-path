import type { Metadata } from 'next';
import { fetchRecipeBySlug } from '@/features/recipes/api';
import { toPlainText, toMetaText } from '@/helpers/wp-text';
import { urls } from '@/config/urls';
import RecipeView from './RecipeView';

interface Props {
    params: Promise<{ slug: string }>;
}

/**
 * Серверная обёртка над клиентской страницей рецепта — только ради метаданных,
 * см. комментарий в src/app/[slug]/page.tsx.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const item = await fetchRecipeBySlug(slug);
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

    return <RecipeView slug={slug} />;
}
