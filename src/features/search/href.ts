/** Параметр запроса на странице поиска: `/search?q=…`. */
export const SEARCH_QUERY_PARAM = 'q';

/**
 * Адрес страницы поиска по запросу. Пустой запрос — `null`: искать нечего.
 *
 * Пробелы передаём как «+» (`как+найти+спокойствие`), остальное кодируем стандартно;
 * `searchParams.get('q')` декодирует «+» обратно в пробелы.
 * `engine` — переключатель движка (`&engine=wp`), его сохраняем, если он уже был в адресе.
 */
export const buildSearchHref = (query: string, engine?: string | null): string | null => {
    const value = query.trim();
    if (!value) return null;
    const q = encodeURIComponent(value).replace(/%20/g, '+');
    return engine
        ? `/search?${SEARCH_QUERY_PARAM}=${q}&engine=${encodeURIComponent(engine)}`
        : `/search?${SEARCH_QUERY_PARAM}=${q}`;
};
