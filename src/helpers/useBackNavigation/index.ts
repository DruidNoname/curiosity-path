'use client';

import { useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

/** Navigation API. В lib.dom TypeScript 5.9 её типов ещё нет — описываем только то, что читаем. */
type NavigationApi = EventTarget & { currentEntry: { index: number } | null };

const getNavigation = () => (window as Window & { navigation?: NavigationApi }).navigation;

const subscribe = (onChange: () => void) => {
    const navigation = getNavigation();
    if (!navigation) return () => {};

    navigation.addEventListener('currententrychange', onChange);
    return () => navigation.removeEventListener('currententrychange', onChange);
};

const isSameOriginReferrer = () => {
    try {
        return new URL(document.referrer).origin === window.location.origin;
    } catch {
        return false;
    }
};

/**
 * В Navigation API в списке записей только записи этого сайта, поэтому индекс больше
 * нуля значит «шаг назад останется на сайте» — с учётом клиентских переходов через
 * `next/link`. Без неё — запасная проверка по `referrer`: она хотя бы не уводит на
 * чужой сайт, но клиентских переходов не видит, `referrer` при них не меняется.
 */
const getSnapshot = () => {
    const navigation = getNavigation();
    if (navigation) return (navigation.currentEntry?.index ?? 0) > 0;

    return window.history.length > 1 && isSameOriginReferrer();
};

// На сервере истории нет: отдаём «На главную», браузер уточнит сразу после гидрации.
const getServerSnapshot = () => false;

/**
 * Кнопка «Назад» в заголовках страниц: возвращает на предыдущую страницу сайта,
 * а если её нет (открыли по прямой ссылке или пришли с другого сайта) — ведёт на главную.
 */
export const useBackNavigation = () => {
    const router = useRouter();
    const canGoBack = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const goBack = () => {
        if (canGoBack) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return { canGoBack, goBack };
};
