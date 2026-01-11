import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        const response = await fetch(
            `${process.env.WP_API_URL}/wp-json/wp/v2/tags?slug=${slug}`
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Тег не найден' },
                { status: 404 }
            );
        }

        const tags = await response.json();

        if (!tags.length) {
            return NextResponse.json(
                { error: 'Тег не найден' },
                { status: 404 }
            );
        }

        return NextResponse.json(tags[0]);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}
