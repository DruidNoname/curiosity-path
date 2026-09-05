import { sanitize } from './sanitize';
import { processHtml } from './pipeline';

/**
 * Единственная точка входа для любого HTML из WordPress: санитизация,
 * затем структурные трансформации. Всё, что идёт в `dangerouslySetInnerHTML`,
 * обязано пройти через неё.
 *
 * Функция дорогая (парсер санитайзера + DOMParser) — результат нужно мемоизировать
 * по входной строке на стороне компонента.
 */
export const getCleanEntry = (html: string): string => {
    if (!html || typeof html !== 'string') return '';

    return processHtml(sanitize(html)).trim();
};
