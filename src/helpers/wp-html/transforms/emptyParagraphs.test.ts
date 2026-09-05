import { applyTransforms } from '../pipeline';
import { removeEmptyParagraphs } from './emptyParagraphs';

const run = (html: string) => applyTransforms(html, [removeEmptyParagraphs]);

describe('removeEmptyParagraphs', () => {
    it('убирает параграфы без текста', () => {
        const result = run('<p>Есть текст</p><p></p><p>   </p><p>&nbsp;</p><p>И ещё</p>');
        expect(result).toBe('<p>Есть текст</p><p>И ещё</p>');
    });

    it('оставляет параграф с картинкой, даже если текста в нём нет', () => {
        const result = run('<p><img src="test.jpg"></p>');
        expect(result).toContain('<img');
    });
});
