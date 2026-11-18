import {buildSearchHref} from './href';

describe('buildSearchHref', () => {
    it('собирает адрес поиска, пробелы — плюсами', () => {
        expect(buildSearchHref('как найти спокойствие'))
            .toBe('/search?q=%D0%BA%D0%B0%D0%BA+%D0%BD%D0%B0%D0%B9%D1%82%D0%B8+%D1%81%D0%BF%D0%BE%D0%BA%D0%BE%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D0%B5');
    });

    it('обрезает пробелы по краям', () => {
        expect(buildSearchHref('  lake  ')).toBe('/search?q=lake');
    });

    it('пустой запрос — null', () => {
        expect(buildSearchHref('')).toBeNull();
        expect(buildSearchHref('   ')).toBeNull();
    });

    it('кодирует служебные символы', () => {
        expect(buildSearchHref('a&b=c+d')).toBe('/search?q=a%26b%3Dc%2Bd');
    });

    it('сохраняет движок, если он задан', () => {
        expect(buildSearchHref('lake', 'wp')).toBe('/search?q=lake&engine=wp');
        expect(buildSearchHref('lake', null)).toBe('/search?q=lake');
    });

    it('декодируется обратно в исходный запрос', () => {
        const href = buildSearchHref('чума и лес')!;
        expect(new URL(href, 'https://x.test').searchParams.get('q')).toBe('чума и лес');
    });
});
