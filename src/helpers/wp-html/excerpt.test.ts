import { createExcerpt } from './excerpt';

describe('createExcerpt', () => {
    it('возвращает содержимое целиком, если оно короче предела', () => {
        expect(createExcerpt('<p>Short text</p>', 1200)).toBe('<p>Short text</p>');
    });

    it('обрезает содержимое длиннее предела', () => {
        const result = createExcerpt('<p>' + 'a'.repeat(1500) + '</p>', 1200);
        expect(result.length).toBeLessThanOrEqual(1200 + 7); // +7 на <p>...</p>
        expect(result).toContain('...');
        expect(result).toMatch(/^<p>/);
    });

    it('при обрезке отбрасывает разметку и оставляет только текст', () => {
        const result = createExcerpt('<h1>Title</h1><p>' + 'b'.repeat(1500) + '</p>', 1200);
        expect(result).toContain('...');
        expect(result).not.toContain('<h1>');
    });

    it('по умолчанию режет по 1200 символов', () => {
        expect(createExcerpt('<p>' + 'c'.repeat(1500) + '</p>').length).toBeLessThanOrEqual(1207);
    });

    it('возвращает пустую строку на пустом входе', () => {
        expect(createExcerpt('', 100)).toBe('');
    });
});
