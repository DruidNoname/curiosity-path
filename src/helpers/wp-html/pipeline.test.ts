import { applyTransforms, processHtml } from './pipeline';
import { HtmlTransform } from './types';

describe('applyTransforms', () => {
    it('прогоняет шаги в переданном порядке', () => {
        const order: string[] = [];
        const first: HtmlTransform = () => { order.push('first'); };
        const second: HtmlTransform = () => { order.push('second'); };

        applyTransforms('<p>Текст</p>', [first, second]);

        expect(order).toEqual(['first', 'second']);
    });

    it('парсит документ один раз на всю цепочку', () => {
        const seen: Document[] = [];
        const remember: HtmlTransform = doc => { seen.push(doc); };

        applyTransforms('<p>Текст</p>', [remember, remember]);

        expect(seen).toHaveLength(2);
        expect(seen[0]).toBe(seen[1]);
    });

    it('уходит в регекспный фолбэк там, где нет DOMParser', () => {
        const originalDOMParser = global.DOMParser;
        // @ts-expect-error - проверяем серверный сценарий
        global.DOMParser = undefined;

        try {
            expect(applyTransforms('<p>Текст</p><p>&nbsp;</p>', [])).toBe('<p>Текст</p>');
            expect(applyTransforms('<br><br><br><br>', [])).toBe('<br><br>');
        } finally {
            global.DOMParser = originalDOMParser;
        }
    });

    it('не роняет страницу, если шаг бросил исключение', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const broken: HtmlTransform = () => { throw new Error('сломался'); };

        expect(applyTransforms('<p>Текст</p>', [broken])).toBe('<p>Текст</p>');
        expect(warn).toHaveBeenCalled();

        warn.mockRestore();
    });
});

describe('processHtml', () => {
    it('прогоняет полный набор шагов', () => {
        const html = '<p>Валидный</p><p>&nbsp;</p><img src="test.jpg"><br><br><br>';
        const result = processHtml(html);

        expect(result).toContain('<p>Валидный</p>');
        expect(result).not.toMatch(/<p>\s*<\/p>/);
        expect(result).toContain('lonely-image__wrapper');
        expect((result.match(/<br>/g) || []).length).toBe(2);
    });
});
