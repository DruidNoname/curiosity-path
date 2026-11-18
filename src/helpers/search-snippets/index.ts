/**
 * Фрагменты записи вокруг найденных слов — для выдачи поиска.
 *
 * WP ищет каждое слово запроса как подстроку (`LIKE '%лес%'`) в заголовке, анонсе и
 * тексте, без учёта регистра. Готовых фрагментов он не отдаёт, но `content.rendered`
 * и `excerpt.rendered` и так приходят в ответе — фрагменты режутся здесь, на клиенте,
 * без дополнительных запросов.
 *
 * Что считать совпадением, решает `Matcher`. `createSubstringMatcher` повторяет
 * поведение базы WP: без регистра, «ё» = «е», подстрока внутри слова тоже совпадение
 * («лес» во «всплесках») — раз WP нашёл запись по ней, честнее её показать.
 * Поиск по словоформам подставляет `createWordsMatcher` со словами от плагина WP.
 *
 * Работает с простым текстом (через `toPlainText`), а не с HTML: результат идёт
 * в текстовые узлы React, `dangerouslySetInnerHTML` здесь не нужен. Без DOM —
 * поэтому тестируется и считается где угодно.
 */
import {toPlainText} from "@/helpers/wp-text";

export type SnippetPart = { text: string; match: boolean };
export type Snippet = SnippetPart[];

export type SnippetsResult = {
    snippets: Snippet[];
    /** Сколько ещё предложений с совпадениями не попало в `snippets` из-за лимита. */
    rest: number;
};

export const MAX_SNIPPETS = 5;
/** Длиннее — предложение обрезается до окна вокруг первого совпадения. */
export const MAX_SNIPPET_LENGTH = 240;

/**
 * Посимвольная нормализация: длина строки не меняется, поэтому индексы совпадений
 * в нормализованной строке годятся и для исходной.
 */
export const normalize = (text: string): string =>
    Array.from(text, (char) => {
        const lower = char.toLowerCase();
        // единичные символы при смене регистра становятся двумя (`İ`) — такие не трогаем
        if (lower.length !== char.length) return char;
        return lower === 'ё' ? 'е' : lower;
    }).join('');

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Слова запроса так, как их понимает WP: фраза в кавычках — одно слово, слово
 * с минусом в начале — исключение (в записи его нет, подсвечивать нечего).
 */
export const getSearchTerms = (query: string): string[] => {
    const terms = new Set<string>();
    const tokens = query.match(/"[^"]*"|\S+/g) ?? [];

    for (const token of tokens) {
        if (token.startsWith('-')) continue;
        const term = normalize(token.replace(/^"|"$/g, '').trim());
        if (term) terms.add(term);
    }

    // длинные вперёд: в альтернации регекспа «лесной» должен победить «лес»
    return [...terms].sort((a, b) => b.length - a.length);
};

/** Где в строке совпадения: отрезки `[start, end)`, по возрастанию и без пересечений. */
export type Matcher = (text: string) => Array<[number, number]>;

/**
 * Совпадение — подстрока, как у WP: «лес» находится и во «всплесках».
 * `null`, если в запросе нет слов.
 */
export const createSubstringMatcher = (query: string): Matcher | null => {
    const terms = getSearchTerms(query);
    if (!terms.length) return null;
    const regexp = new RegExp(terms.map(escapeRegExp).join('|'), 'g');

    return (text) => Array.from(normalize(text).matchAll(regexp), (found): [number, number] =>
        [found.index, found.index + found[0].length]);
};

const WORD = /[\p{L}\p{N}]+/gu;

/**
 * Совпадение — целое слово из списка. Список словоформ присылает плагин поиска WP
 * (`matchedWords`): он сам решил по основам, какие слова подходят, и стеммер в
 * браузер не едет. Сравнение — без регистра и с «ё» = «е».
 */
export const createWordsMatcher = (words: string[]): Matcher | null => {
    const wanted = new Set(words.map(normalize));
    if (!wanted.size) return null;

    return (text) => Array.from(text.matchAll(WORD))
        .filter((found) => wanted.has(normalize(found[0])))
        .map((found): [number, number] => [found.index, found.index + found[0].length]);
};

/** Режет строку на куски «совпадение / не совпадение». */
const splitByMatches = (text: string, matcher: Matcher): Snippet => {
    const parts: Snippet = [];
    let last = 0;

    for (const [start, end] of matcher(text)) {
        if (start > last) parts.push({text: text.slice(last, start), match: false});
        parts.push({text: text.slice(start, end), match: true});
        last = end;
    }
    if (last < text.length) parts.push({text: text.slice(last), match: false});

    return parts;
};

/** Подсвечивает совпадения в строке целиком — для заголовка. */
export const highlightText = (text: string, matcher: Matcher | null): Snippet =>
    matcher ? splitByMatches(text, matcher) : [{text, match: false}];

// Границы блоков, после которых предложение заканчивается, даже если точки нет:
// пункт списка, строка стихотворения через <br>, подпись к картинке.
const BLOCK_BOUNDARY = /<\/(?:p|li|h[1-6]|div|figcaption|blockquote|pre|td|th|dt|dd|summary)\s*>|<br\s*\/?>/i;

// Конец предложения: знак препинания (с закрывающей кавычкой или скобкой), пробел,
// а дальше заглавная буква, цифра, открывающая кавычка или тире. Сокращения вроде
// «А.Н. Костромин» разрежутся — для фрагмента выдачи это не страшно.
const SENTENCE_BOUNDARY = /(?<=[.!?…]["»”)]?)\s+(?=[A-ZА-ЯЁ0-9"«„(—–-])/u;

/** HTML записи → предложения простым текстом. */
const toSentences = (html: string): string[] =>
    html
        .split(BLOCK_BOUNDARY)
        .map((block) => toPlainText(block))
        .filter(Boolean)
        .flatMap((block) => block.split(SENTENCE_BOUNDARY))
        .map((sentence) => sentence.trim())
        .filter(Boolean);

/** Длинное предложение обрезается до окна вокруг первого совпадения, по границам слов. */
const clip = (sentence: string, firstMatch: number): string => {
    if (sentence.length <= MAX_SNIPPET_LENGTH) return sentence;

    let start = Math.max(0, firstMatch - Math.floor(MAX_SNIPPET_LENGTH / 3));
    let end = Math.min(sentence.length, start + MAX_SNIPPET_LENGTH);
    start = Math.max(0, end - MAX_SNIPPET_LENGTH);

    if (start > 0) {
        const space = sentence.indexOf(' ', start);
        if (space !== -1 && space < firstMatch) start = space + 1;
    }
    if (end < sentence.length) {
        const space = sentence.lastIndexOf(' ', end);
        if (space > firstMatch) end = space;
    }

    return `${start > 0 ? '…' : ''}${sentence.slice(start, end)}${end < sentence.length ? '…' : ''}`;
};

/**
 * Предложения с совпадениями, размеченные. Пустой `snippets` — совпадение там,
 * где его не видно (атрибут, шорткод, разметка блока), и вызывающему нужен
 * запасной вариант.
 */
const getSnippetsFromSentences = (
    sentences: string[],
    matcher: Matcher | null,
    limit: number = MAX_SNIPPETS,
): SnippetsResult => {
    if (!matcher) return {snippets: [], rest: 0};

    const matching: string[] = [];
    for (const sentence of sentences) {
        const [first] = matcher(sentence);
        if (first) matching.push(clip(sentence, first[0]));
    }

    return {
        snippets: matching.slice(0, limit).map((sentence) => splitByMatches(sentence, matcher)),
        rest: Math.max(0, matching.length - limit),
    };
};

/** То же из HTML записи: `content.rendered` или `excerpt.rendered`. */
export const getSearchSnippets = (
    html: string | null | undefined,
    matcher: Matcher | null,
    limit: number = MAX_SNIPPETS,
): SnippetsResult =>
    html && matcher ? getSnippetsFromSentences(toSentences(html), matcher, limit) : {snippets: [], rest: 0};
