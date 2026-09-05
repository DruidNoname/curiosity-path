/**
 * HTML из WordPress → простой текст.
 *
 * WP отдаёт заголовки и анонсы как HTML: с тегами, неразрывными пробелами и
 * сущностями (`&laquo;`, `&#8230;`). Там, где строка попадает не в разметку,
 * а в текст — тултип, `alt`, `<meta>`, `document.title`, — браузер сущности не
 * раскодирует, и пользователь видит `первый раз в первый&#8230;` буквально.
 *
 * Пара к `helpers/wp-html`, и делить их надо по назначению строки:
 * `wp-html` — когда результат идёт в `dangerouslySetInnerHTML` и разметка нужна;
 * `wp-text` — когда нужен голый текст без разметки вообще.
 *
 * Отсюда и разная реализация: `wp-html` опирается на `DOMParser` и потому помечен
 * `'use client'`, а здесь всё на регекспах, без DOM, — иначе модуль нельзя было бы
 * звать из `generateMetadata`, который считается на сервере.
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
