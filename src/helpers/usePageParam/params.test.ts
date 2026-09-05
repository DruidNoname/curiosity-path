import { parsePage, buildPageHref, PAGE_PARAM } from './params';

describe('parsePage', () => {
    it('читает нормальный номер страницы', () => {
        expect(parsePage('2')).toBe(2);
        expect(parsePage('147')).toBe(147);
    });

    it('отсутствие параметра — первая страница', () => {
        expect(parsePage(null)).toBe(1);
        expect(parsePage(undefined)).toBe(1);
        expect(parsePage('')).toBe(1);
    });

    it('мусор из чужой ссылки не роняет страницу', () => {
        expect(parsePage('abc')).toBe(1);
        expect(parsePage('2abc')).toBe(1);
        expect(parsePage('  ')).toBe(1);
        expect(parsePage('Infinity')).toBe(1);
        expect(parsePage('NaN')).toBe(1);
    });

    it('ноль, минус и дробь — первая страница', () => {
        expect(parsePage('0')).toBe(1);
        expect(parsePage('-3')).toBe(1);
        expect(parsePage('1.5')).toBe(1);
    });
});

describe('buildPageHref', () => {
    it('первая страница остаётся без параметра', () => {
        expect(buildPageHref('/', new URLSearchParams(), 1)).toBe('/');
        expect(buildPageHref('/', new URLSearchParams(`${PAGE_PARAM}=5`), 1)).toBe('/');
    });

    it('добавляет номер страницы начиная со второй', () => {
        expect(buildPageHref('/', new URLSearchParams(), 2)).toBe('/?page=2');
        expect(buildPageHref('/tag/les', new URLSearchParams(), 3)).toBe('/tag/les?page=3');
    });

    it('заменяет уже стоящий номер, а не добавляет второй', () => {
        expect(buildPageHref('/', new URLSearchParams('page=2'), 7)).toBe('/?page=7');
    });

    it('сохраняет остальные параметры', () => {
        expect(buildPageHref('/search', new URLSearchParams('q=лес'), 2))
            .toBe('/search?q=%D0%BB%D0%B5%D1%81&page=2');
    });

    it('убирая страницу, не теряет остальные параметры', () => {
        expect(buildPageHref('/search', new URLSearchParams('q=лес&page=4'), 1))
            .toBe('/search?q=%D0%BB%D0%B5%D1%81');
    });
});
