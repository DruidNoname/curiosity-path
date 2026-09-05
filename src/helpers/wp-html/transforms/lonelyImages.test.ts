import { applyTransforms } from '../pipeline';
import { wrapLonelyImages } from './lonelyImages';

const run = (html: string) => applyTransforms(html, [wrapLonelyImages]);

describe('wrapLonelyImages', () => {
    it('оборачивает картинку без подписи', () => {
        const result = run('<img src="test.jpg">');
        expect(result).toBe('<span class="lonely-image__wrapper"><img src="test.jpg"></span>');
    });

    it('не трогает картинки внутри <figure>: у них своя обработка', () => {
        const result = run('<figure><img src="test.jpg"><figcaption>Подпись</figcaption></figure>');
        expect(result).not.toContain('lonely-image__wrapper');
    });

    it('переносит классы выравнивания с картинки на обёртку', () => {
        const result = run('<img src="test.jpg" class="alignnone wp-image-683 size-large">');
        expect(result).toContain('<span class="alignnone lonely-image__wrapper">');
        expect(result).toContain('class="wp-image-683 size-large"');
    });

    it('оставляет неплавающую картинку на её месте в абзаце', () => {
        const result = run('<p>Текст до <img src="test.jpg"> текст после</p>');
        expect(result).toMatch(/Текст до\s*<span class="lonely-image__wrapper">/);
        expect(result).not.toMatch(/^<p><span/);
    });

    it('оставляет на месте и aligncenter: он не плавает, а только центрируется', () => {
        const result = run('<p>Текст до <img src="test.jpg" class="aligncenter"> текст после</p>');
        expect(result).toMatch(/Текст до\s*<span class="aligncenter lonely-image__wrapper">/);
    });

    it.each(['alignleft', 'alignright'])(
        'поднимает плавающую картинку (%s) в начало абзаца: иначе текст до неё не обтекает',
        align => {
            const result = run(`<p>Текст до <img src="test.jpg" class="${align}"> текст после</p>`);
            expect(result).toMatch(new RegExp(`^<p><span class="${align} lonely-image__wrapper">`));
            expect(result).toContain('Текст до');
            expect(result).toContain('текст после');
        }
    );
});
