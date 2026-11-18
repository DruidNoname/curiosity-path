import {
    createSubstringMatcher,
    getSearchSnippets as getSnippets,
    getSearchTerms,
    highlightText as highlight,
    MAX_SNIPPET_LENGTH,
    type Snippet,
} from "./index";

// В тестах — подстрочный поиск, как у WP; запрос передаётся строкой для краткости.
const getSearchSnippets = (html: string, query: string, limit?: number) =>
    getSnippets(html, createSubstringMatcher(query), limit);
const highlightText = (text: string, query: string) => highlight(text, createSubstringMatcher(query));

const asText = (snippet: Snippet) => snippet.map((p) => p.text).join('');
const matches = (snippet: Snippet) => snippet.filter((p) => p.match).map((p) => p.text);

describe('getSearchTerms', () => {
    it('делит запрос на слова, без регистра и с ё = е', () => {
        expect(getSearchTerms('Лёс  Поле')).toEqual(['поле', 'лес']);
    });

    it('фраза в кавычках — одно слово, слово с минусом пропускается', () => {
        expect(getSearchTerms('"по лесу" -поле')).toEqual(['по лесу']);
    });

    it('убирает повторы, длинные слова идут первыми', () => {
        expect(getSearchTerms('лес лесной ЛЕС')).toEqual(['лесной', 'лес']);
    });

    it('пустой запрос — пустой список', () => {
        expect(getSearchTerms('   ')).toEqual([]);
    });
});

describe('getSearchSnippets', () => {
    const html = `
        <p>Утром было тихо. Тыгыдыкала по лесу, распушаясь и оглядываясь на нас. Потом обед.</p>
        <p>Пошла шуровать по лесу, когда я отправилась гулять с Лёвочкой в слинге.</p>
        <ul><li>Без точки в конце, но про Лес</li><li>Ничего интересного</li></ul>
    `;

    it('собирает все предложения с совпадениями, по одному на фрагмент', () => {
        const {snippets, rest} = getSearchSnippets(html, 'лес');

        expect(snippets.map(asText)).toEqual([
            'Тыгыдыкала по лесу, распушаясь и оглядываясь на нас.',
            'Пошла шуровать по лесу, когда я отправилась гулять с Лёвочкой в слинге.',
            'Без точки в конце, но про Лес',
        ]);
        expect(rest).toBe(0);
    });

    it('размечает совпадение, сохраняя исходный регистр и букву ё', () => {
        const {snippets} = getSearchSnippets('<p>Лёс и ЛЕС.</p>', 'лес');
        expect(matches(snippets[0])).toEqual(['Лёс', 'ЛЕС']);
    });

    it('подсвечивает подстроку внутри слова, как её находит WP', () => {
        const {snippets} = getSearchSnippets('<p>Всплески тревоги.</p>', 'лес');
        expect(snippets[0]).toEqual([
            {text: 'Всп', match: false},
            {text: 'лес', match: true},
            {text: 'ки тревоги.', match: false},
        ]);
    });

    it('раскодирует сущности и снимает теги', () => {
        const {snippets} = getSearchSnippets('<p>На <em>опушке</em> леса &#8212; тишина.</p>', 'леса');
        expect(asText(snippets[0])).toBe('На опушке леса — тишина.');
    });

    it('сверх лимита фрагменты не отдаёт, но считает', () => {
        const many = Array.from({length: 7}, (_, i) => `<p>Лес номер ${i}.</p>`).join('');
        const {snippets, rest} = getSearchSnippets(many, 'лес', 5);
        expect(snippets).toHaveLength(5);
        expect(rest).toBe(2);
    });

    it('длинное предложение обрезает до окна вокруг совпадения', () => {
        const long = `${'слово '.repeat(80)}лес ${'слово '.repeat(80)}`.trim();
        const {snippets} = getSearchSnippets(`<p>${long}</p>`, 'лес');
        const text = asText(snippets[0]);

        expect(text.startsWith('…')).toBe(true);
        expect(text.endsWith('…')).toBe(true);
        expect(text.length).toBeLessThanOrEqual(MAX_SNIPPET_LENGTH + 2);
        expect(matches(snippets[0])).toEqual(['лес']);
    });

    it('не находит совпадение в атрибутах — пусто, нужен запасной вариант', () => {
        const {snippets} = getSearchSnippets('<p><img alt="лес" src="x.jpg"> Поле.</p>', 'лес');
        expect(snippets).toEqual([]);
    });

    it('спецсимволы запроса не ломают регексп', () => {
        const {snippets} = getSearchSnippets('<p>Цена (примерно) 5$.</p>', '(примерно)');
        expect(matches(snippets[0])).toEqual(['(примерно)']);
    });

    it('пустые вход или запрос — пусто', () => {
        expect(getSearchSnippets('', 'лес')).toEqual({snippets: [], rest: 0});
        expect(getSearchSnippets('<p>Лес.</p>', '  ')).toEqual({snippets: [], rest: 0});
    });
});

describe('highlightText', () => {
    it('размечает все слова запроса в строке', () => {
        expect(matches(highlightText('Лес и поле', 'поле лес'))).toEqual(['Лес', 'поле']);
    });

    it('без слов запроса отдаёт строку целиком', () => {
        expect(highlightText('Лес', '')).toEqual([{text: 'Лес', match: false}]);
    });
});
