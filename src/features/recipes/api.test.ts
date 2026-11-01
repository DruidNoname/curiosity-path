import { fetchKeywordId, fetchRecipes, fetchTaxonomy } from './api';

const mockResponse = (body: unknown, { ok = true, headers = {} as Record<string, string> } = {}) => ({
    ok,
    json: async () => body,
    headers: { get: (name: string) => headers[name] ?? null },
});

const fetchMock = jest.fn();
const lastUrl = () => new URL(fetchMock.mock.calls.at(-1)[0]);

beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
});

describe('fetchRecipes', () => {
    it('передаёт страницу, раздел и ключевое слово параметрами запроса', async () => {
        fetchMock.mockResolvedValue(mockResponse([]));

        await fetchRecipes({ page: 3, perPage: 12, courseId: 7, keywordId: 9 });

        const url = lastUrl();
        expect(url.pathname).toMatch(/\/wprm_recipe$/);
        expect(Object.fromEntries(url.searchParams)).toEqual({
            page: '3', per_page: '12', wprm_course: '7', wprm_keyword: '9',
        });
    });

    it('без раздела и ключевого слова не шлёт пустых фильтров', async () => {
        fetchMock.mockResolvedValue(mockResponse([]));

        await fetchRecipes({ page: 1, perPage: 10 });

        expect(lastUrl().searchParams.has('wprm_course')).toBe(false);
        expect(lastUrl().searchParams.has('wprm_keyword')).toBe(false);
    });

    it('возвращает общий контракт списка', async () => {
        fetchMock.mockResolvedValue(mockResponse([{ id: 1 }], {
            headers: { 'X-WP-Total': '25', 'X-WP-TotalPages': '3' },
        }));

        await expect(fetchRecipes({ page: 2, perPage: 10 })).resolves.toEqual({
            recipes: [{ id: 1 }], total: 25, totalPages: 3, currentPage: 2, perPage: 10,
        });
    });

    it('бросает ошибку, если WordPress ответил не 2xx', async () => {
        fetchMock.mockResolvedValue(mockResponse({}, { ok: false }));
        await expect(fetchRecipes()).rejects.toThrow('Ошибка при получении рецептов');
    });
});

describe('fetchKeywordId', () => {
    it('возвращает id найденного ключевого слова', async () => {
        fetchMock.mockResolvedValue(mockResponse([{ id: 42 }]));

        await expect(fetchKeywordId('bez-sahara')).resolves.toBe(42);
        expect(lastUrl().searchParams.get('slug')).toBe('bez-sahara');
    });

    it('возвращает null, если такого ключевого слова нет', async () => {
        fetchMock.mockResolvedValue(mockResponse([]));
        await expect(fetchKeywordId('net-takogo')).resolves.toBeNull();
    });

    it('при ошибке WordPress бросает исключение, а не притворяется «не найдено»', async () => {
        fetchMock.mockResolvedValue(mockResponse({ code: 'rest_error' }, { ok: false }));
        await expect(fetchKeywordId('bez-sahara')).rejects.toThrow();
    });
});

describe('fetchTaxonomy', () => {
    it('собирает параметры с умолчаниями', async () => {
        fetchMock.mockResolvedValue(mockResponse([]));

        await fetchTaxonomy('https://wp.test/wp-json/wp/v2/wprm_course', 'courses');

        expect(Object.fromEntries(lastUrl().searchParams)).toEqual({
            per_page: '100', orderby: 'count', order: 'desc', hide_empty: 'true',
        });
    });

    it('hideEmpty: false не шлёт hide_empty', async () => {
        fetchMock.mockResolvedValue(mockResponse([]));

        await fetchTaxonomy('https://wp.test/x', 'courses', { hideEmpty: false });

        expect(lastUrl().searchParams.has('hide_empty')).toBe(false);
    });

    it('берёт текст ошибки из ответа WordPress', async () => {
        fetchMock.mockResolvedValue(mockResponse({ message: 'Нет доступа' }, { ok: false }));
        await expect(fetchTaxonomy('https://wp.test/x', 'courses')).rejects.toThrow('Нет доступа');
    });
});
