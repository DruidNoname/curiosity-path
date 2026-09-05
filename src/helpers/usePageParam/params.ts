/**
 * Чистая часть пагинации: разбор и сборка адреса со страницей.
 *
 * Без React и без `'use client'` — это просто работа со строками, её удобно
 * проверять и переиспользовать отдельно от хука.
 */

/** Имя query-параметра со страницей: `/tag/foo?page=3`. */
export const PAGE_PARAM = 'page';

/**
 * Разбирает значение параметра в номер страницы.
 *
 * Всё, что не целое число больше нуля (мусор, ноль, минус, дробь, пустая строка,
 * отсутствие параметра), считается первой страницей — по ссылке из чужих рук может
 * прийти что угодно, и падать из-за этого страница не должна.
 */
export const parsePage = (raw: string | null | undefined): number => {
    if (!raw) return 1;

    const parsed = Number(raw);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

/**
 * Строит путь со страницей в query. Первая страница параметра не получает,
 * чтобы ссылка на начало списка оставалась чистой.
 *
 * Остальные параметры сохраняются: на `/search?q=лес` пагинация не потеряет запрос.
 */
export const buildPageHref = (
    pathname: string,
    // подходит и URLSearchParams, и ReadonlyURLSearchParams из next/navigation
    searchParams: { toString(): string },
    page: number,
): string => {
    const params = new URLSearchParams(searchParams.toString());

    if (page > 1) {
        params.set(PAGE_PARAM, String(page));
    } else {
        params.delete(PAGE_PARAM);
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
};
