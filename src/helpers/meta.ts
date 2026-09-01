/**
 * Подготовка текста из WordPress для метатегов.
 *
 * WP отдаёт заголовки и анонсы как HTML: с тегами, неразрывными пробелами и
 * сущностями (`&laquo;`, `&#8230;`). В `<meta>` это класть нельзя — превью покажет
 * разметку как есть.
 *
 * Отдельный от `helpers/utils.ts` модуль намеренно: тот помечен `'use client'`,
 * потому что опирается на DOMParser, а метаданные считаются на сервере.
 */

const NAMED_ENTITIES: Record<string, string> = {
    nbsp: ' ',
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    laquo: '«',
    raquo: '»',
    mdash: '—',
    ndash: '–',
    hellip: '…',
    ldquo: '“',
    rdquo: '”',
    lsquo: '‘',
    rsquo: '’',
    bdquo: '„',
    shy: '',
};

const decodeEntities = (text: string): string =>
    text
        .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
        .replace(/&([a-z]+);/gi, (match, name) => {
            const decoded = NAMED_ENTITIES[String(name).toLowerCase()];
            return decoded === undefined ? match : decoded;
        });

/** Превращает HTML из WordPress в одну строку простого текста. */
export const toPlainText = (html?: string | null): string => {
    if (!html) return '';

    const withoutTags = html
        // содержимое script/style в текст попасть не должно
        .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
        // блочные границы превращаем в пробел, иначе слова слипнутся
        .replace(/<\/(p|div|li|h[1-6]|br)\s*>/gi, ' ')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]+>/g, '');

    return decodeEntities(withoutTags)
        // неразрывный пробел -> обычный, мягкие переносы и нулевую ширину выбрасываем
        .replace(/\u00A0/g, ' ')
        .replace(/[\u00AD\u200B\uFEFF]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

/** Обрезает текст по границе слова, добавляя многоточие. */
export const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;

    const cut = text.slice(0, maxLength);
    const lastSpace = cut.lastIndexOf(' ');
    const body = (lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd();

    return `${body.replace(/[.,;:!?—–-]+$/, '')}…`;
};

/** Готовый однострочный текст для `<meta>`: снимает разметку и обрезает. */
export const toMetaText = (html?: string | null, maxLength = 200): string =>
    truncate(toPlainText(html), maxLength);
