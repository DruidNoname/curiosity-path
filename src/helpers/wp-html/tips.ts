import { getCleanEntry } from './clean';

/** Шорткод советов из WP Recipe Maker: `[wprm-tip icon="..."]…[/wprm-tip]`. */
const TIP_SHORTCODE = /\[wprm-tip(?:\s+icon="[^"]*")?\]([\s\S]*?)\[\/wprm-tip\]/g;
const EMPTY_PARAGRAPH = /<p[^>]*>\s*<\/p>/gi;

/**
 * Вытаскивает советы из шорткодов и собирает их в список, а остаток текста
 * отдаёт следом.
 *
 * Содержимое советов обязано пройти через `getCleanEntry` наравне с остальным HTML
 * из WP: результат уходит в `dangerouslySetInnerHTML` (см. `RecipeTips`).
 */
export const createTips = (html: string): string => {
    if (!html || typeof html !== 'string') return '';

    const tips = Array.from(html.matchAll(TIP_SHORTCODE))
        .map(match => getCleanEntry(match[1].trim()))
        .filter(Boolean);

    // Остаток — тот же HTML без шорткодов; пустые обёртки <p> после вырезания убираем.
    const rest = html
        .replace(TIP_SHORTCODE, '')
        .replace(EMPTY_PARAGRAPH, '')
        .trim();

    const list = tips.length > 0
        ? `<ul>${tips.map(tip => `<li>${tip}</li>`).join('')}</ul>`
        : '';

    return list + (rest ? getCleanEntry(rest) : '');
};
