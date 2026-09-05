import { getCleanEntry } from './clean';

const DEFAULT_MAX_LENGTH = 1200;
const ELLIPSIS = '...';

/**
 * Превью записи: тот же очищенный HTML, но если текста слишком много —
 * обрезанный до простого параграфа.
 */
export const createExcerpt = (html: string, maxLength: number = DEFAULT_MAX_LENGTH): string => {
    const clean = getCleanEntry(html);

    // Длина разметки — верхняя оценка длины текста: если уложились, резать точно нечего.
    if (clean.length <= maxLength) return clean;

    const container = document.createElement('div');
    container.innerHTML = clean;
    const text = container.textContent || '';

    if (text.length <= maxLength) return clean;

    return `<p>${text.substring(0, maxLength - ELLIPSIS.length)}${ELLIPSIS}</p>`;
};
