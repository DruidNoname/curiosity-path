'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { PAGE_PARAM, parsePage, buildPageHref } from './params';

export { PAGE_PARAM, parsePage, buildPageHref };

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
