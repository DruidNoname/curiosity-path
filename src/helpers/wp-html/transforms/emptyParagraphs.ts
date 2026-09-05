import { HtmlTransform } from '../types';

/**
 * Пустой параграф — тот, в котором нет ни текста, ни картинки.
 *
 * Отдельная чистка `&nbsp;` не нужна: в `textContent` он приходит как `\u00A0`,
 * а его срезает `trim()`.
 */
const isEmptyParagraph = (element: Element): boolean => {
    if (element.tagName !== 'P') return false;
    if (element.querySelector('img')) return false;

    return (element.textContent || '').trim() === '';
};

/** Выбрасывает пустые параграфы, которыми WP разделяет блоки. */
export const removeEmptyParagraphs: HtmlTransform = doc => {
    Array.from(doc.body.getElementsByTagName('p'))
        .filter(isEmptyParagraph)
        .forEach(paragraph => paragraph.remove());
};
