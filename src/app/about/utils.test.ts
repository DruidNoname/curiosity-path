import { yearsWord } from './utils';

describe('yearsWord', () => {
    it('последняя цифра 1 — «годик»', () => {
        expect(yearsWord(41)).toBe('годик');
        expect(yearsWord(51)).toBe('годик');
    });

    it('последняя цифра 2, 3 или 4 — «годика»', () => {
        expect(yearsWord(42)).toBe('годика');
        expect(yearsWord(43)).toBe('годика');
        expect(yearsWord(44)).toBe('годика');
    });

    it('последняя цифра 5–9 или 0 — «годиков»', () => {
        expect(yearsWord(39)).toBe('годиков');
        expect(yearsWord(40)).toBe('годиков');
        expect(yearsWord(45)).toBe('годиков');
        expect(yearsWord(48)).toBe('годиков');
    });
});
