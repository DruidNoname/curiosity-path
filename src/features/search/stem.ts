/**
 * Слова → основы: «лес», «лесу», «лесом» сводятся к одной основе «лес».
 *
 * Стеммер Snowball отрезает окончания по правилам, без словаря: быстрый, но
 * однокоренные слова с разными суффиксами не склеивает («лесной» → «лесн»).
 * Одна и та же функция работает и при индексации, и для запроса, и для подсветки —
 * поэтому подсвечивается ровно то, по чему запись нашлась.
 */
import {newStemmer} from 'snowball-stemmers';
import {normalize, type Matcher} from '@/helpers/search-snippets';

const russian = newStemmer('russian');
const english = newStemmer('english');

const WORD = /[\p{L}\p{N}]+/gu;

/**
 * Служебные слова: они есть почти в каждой записи. В запросе «по лесу» без этого
 * списка «по» требовалось бы найти, а потом подсвечивалось бы в каждой строке.
 */
const STOP_WORDS = new Set([
    'а', 'без', 'в', 'во', 'да', 'для', 'до', 'же', 'за', 'и', 'из', 'или', 'к', 'ко',
    'ли', 'на', 'над', 'не', 'ни', 'о', 'об', 'от', 'по', 'под', 'при', 'про', 'с',
    'со', 'то', 'у', 'что', 'это', 'как', 'так', 'бы', 'но',
]);

/** Основа слова или `null`, если слово служебное. */
export const stemWord = (word: string): string | null => {
    const normalized = normalize(word);
    if (STOP_WORDS.has(normalized)) return null;
    return /^[a-z0-9]+$/.test(normalized) ? english.stem(normalized) : russian.stem(normalized);
};

/** Слова строки: буквы и цифры, всё остальное — разделители. */
export const tokenize = (text: string): string[] => text.match(WORD) ?? [];

/** Основы слов запроса без служебных. */
export const getQueryStems = (query: string): Set<string> =>
    new Set(tokenize(query).map(stemWord).filter((stem): stem is string => Boolean(stem)));

/** Совпадение — целое слово с той же основой, что у слова запроса. */
export const createStemMatcher = (query: string): Matcher | null => {
    const stems = getQueryStems(query);
    if (!stems.size) return null;

    return (text) => {
        const ranges: Array<[number, number]> = [];
        for (const found of text.matchAll(WORD)) {
            const stem = stemWord(found[0]);
            if (stem && stems.has(stem)) ranges.push([found.index, found.index + found[0].length]);
        }
        return ranges;
    };
};
