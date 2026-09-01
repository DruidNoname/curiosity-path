'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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

/**
 * Номер страницы, живущий в URL.
 *
 * Нужен, чтобы ссылку с конкретной страницей списка можно было переслать, положить
 * в закладки и вернуться к ней кнопкой «назад». Раньше страница хранилась в
 * `useState` и из адреса не читалась.
 *
 * Компонент, который это вызывает, обязан быть под `<Suspense>`: `useSearchParams`
 * этого требует, иначе статическая страница не соберётся.
 */
export const usePageParam = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const page = parsePage(searchParams.get(PAGE_PARAM));

    const setPage = useCallback((next: number) => {
        // scroll: false — Next иначе прыгает мгновенно; прокручиваем сами и плавно.
        router.push(buildPageHref(pathname, searchParams, next), { scroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname, router, searchParams]);

    return { page, setPage };
};
