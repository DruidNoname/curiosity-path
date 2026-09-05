import { HtmlTransform } from './types';
import { TRANSFORMS } from './transforms';

/**
 * Фолбэк для окружения без DOM (сервер) и на случай падения парсера.
 * Повторяет регекспами только то, что можно сделать без дерева.
 */
const EMPTY_PARAGRAPH = /<p[^>]*>\s*(&nbsp;|\u00A0|<\/?br\s*\/?>|\s)*<\/p>/gi;
const BREAK_CHAIN = /(<br\s*\/?>\s*){3,}/gi;

const fallback = (html: string): string =>
    html.replace(EMPTY_PARAGRAPH, '').replace(BREAK_CHAIN, '<br><br>');

/**
 * Один парсер на всю цепочку: строка → дерево → шаги по очереди → строка.
 * Вынесено отдельным экспортом, чтобы шаги можно было прогонять поштучно в тестах.
 */
export const applyTransforms = (html: string, transforms: readonly HtmlTransform[]): string => {
    try {
        if (typeof DOMParser === 'undefined') return fallback(html);

        const doc = new DOMParser().parseFromString(html, 'text/html');
        transforms.forEach(transform => transform(doc));

        return doc.body.innerHTML;
    } catch (error) {
        console.warn('DOMParser error:', error);
        return fallback(html);
    }
};

/** Полный конвейер трансформаций в порядке из `transforms/index.ts`. */
export const processHtml = (html: string): string => applyTransforms(html, TRANSFORMS);
