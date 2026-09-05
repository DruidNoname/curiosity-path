import { WP_REST_API_Post } from 'wp-types';
import { getPostsByDate } from './utils';

const post = (id: number, date: string, title: string) => ({
    id,
    date,
    slug: `post-${id}`,
    link: `https://example.com/post-${id}`,
    title: { rendered: title },
}) as unknown as WP_REST_API_Post;

describe('getPostsByDate', () => {
    it('раскладывает посты по датам', () => {
        const map = getPostsByDate([
            post(1, '2026-01-30T10:00:00', 'Первый'),
            post(2, '2026-01-30T18:00:00', 'Второй'),
            post(3, '2026-02-01T10:00:00', 'Третий'),
        ]);

        expect(map.get('2026-01-30')).toHaveLength(2);
        expect(map.get('2026-02-01')).toHaveLength(1);
    });

    it('отдаёт заголовок простым текстом: он уходит в тултип, где сущности не раскодируются', () => {
        const map = getPostsByDate([
            post(1, '2026-01-30T10:00:00', 'первый раз в первый&#8230; комбо'),
            post(2, '2026-01-31T10:00:00', '<em>Вынашивание</em> &laquo;с колокольни&raquo;'),
        ]);

        expect(map.get('2026-01-30')[0].title).toBe('первый раз в первый… комбо');
        expect(map.get('2026-01-31')[0].title).toBe('Вынашивание «с колокольни»');
    });

    it('битая дата не роняет карту', () => {
        const warn = jest.spyOn(console, 'error').mockImplementation(() => {});

        const map = getPostsByDate([
            post(1, 'не дата', 'Плохой'),
            post(2, '2026-01-30T10:00:00', 'Хороший'),
        ]);

        expect(map.get('2026-01-30')).toHaveLength(1);

        warn.mockRestore();
    });
});
