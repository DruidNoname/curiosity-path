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
 * Принимается только каноничная запись: десятичные цифры без ведущего нуля (`3`, `147`).
 * Всё остальное — мусор, ноль, минус, дробь, пустая строка, отсутствие параметра,
 * а также формы, которые понял бы `Number` (`1e2`, `0x10`, `+3`, `3.0`, ` 3 `), —
 * считается первой страницей: по ссылке из чужих рук может прийти что угодно, и
 * падать из-за этого страница не должна. Строгая проверка вместо `Number` — чтобы
 * одной странице соответствовал ровно один адрес.
 */
export const parsePage = (raw: string | null | undefined): number => {
    if (!raw || !/^[1-9]\d*$/.test(raw)) return 1;

    return Number(raw);
};

/**
 * Строит путь со страницей в query. Первая страница параметра не получает,
 * чтобы ссылка на начало списка оставалась чистой.
 *
 * Остальные параметры сохраняются: на `/search?q=лес` пагинация не потеряет запрос.
 */
export const buildPageHref = (
    pathname: string,
    searchParams: URLSearchParams,
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
