import { fetchPostsByTag } from './api';

const mockResponse = (body: unknown, headers: Record<string, string> = {}) => ({
    ok: true,
    json: async () => body,
    headers: { get: (name: string) => headers[name] ?? null },
});

describe('fetchPostsByTag', () => {
    const fetchMock = jest.fn();

    beforeEach(() => {
        fetchMock.mockReset();
        global.fetch = fetchMock as unknown as typeof fetch;
    });

    it('делает один запрос за постами по id тега, без повторного запроса тега', async () => {
        fetchMock.mockResolvedValue(mockResponse([], { 'X-WP-Total': '12', 'X-WP-TotalPages': '2' }));

        await fetchPostsByTag(42, 2, 10);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const url = new URL(fetchMock.mock.calls[0][0]);
        expect(url.pathname).toMatch(/\/posts$/);
        expect(url.searchParams.get('tags')).toBe('42');
        expect(url.searchParams.get('page')).toBe('2');
        expect(url.searchParams.get('per_page')).toBe('10');
        expect(url.searchParams.has('_embed')).toBe(true);
    });

    it('возвращает общий контракт списка', async () => {
        fetchMock.mockResolvedValue(mockResponse(
            [{ id: 1, _embedded: { 'wp:term': [[{ id: 5, name: 'лес', slug: 'les', link: '', taxonomy: 'post_tag' }]] } }],
            { 'X-WP-Total': '12', 'X-WP-TotalPages': '2' },
        ));

        const result = await fetchPostsByTag(42, 2, 10);

        expect(result).toMatchObject({ total: 12, totalPages: 2, currentPage: 2, perPage: 10 });
        expect(result.posts[0]).toMatchObject({ id: 1, postTags: [{ id: 5, slug: 'les' }] });
    });

    it('бросает ошибку, если WordPress ответил не 2xx', async () => {
        fetchMock.mockResolvedValue({ ok: false });
        await expect(fetchPostsByTag(42)).rejects.toThrow('Ошибка при загрузке постов');
    });
});
