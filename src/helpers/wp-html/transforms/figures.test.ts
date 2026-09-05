import { applyTransforms } from '../pipeline';
import { limitFigureWidth } from './figures';

const run = (html: string) => applyTransforms(html, [limitFigureWidth]);

describe('limitFigureWidth', () => {
    it('ограничивает фигуру шириной картинки из атрибута width', () => {
        const result = run('<figure><img src="test.jpg" width="500"><figcaption>Подпись</figcaption></figure>');
        expect(result).toContain('max-width: 500px');
        expect(result).toContain('wp-image-limited');
    });

    it('не берёт ширину из wp-image-<id>: это идентификатор вложения, а не пиксели', () => {
        const result = run('<figure><img src="test.jpg" class="wp-image-371"><figcaption>Подпись</figcaption></figure>');
        expect(result).not.toContain('max-width');
        expect(result).not.toContain('wp-image-limited');
    });

    it('не трогает фигуру без подписи', () => {
        const result = run('<figure><img src="test.jpg" width="500"></figure>');
        expect(result).not.toContain('wp-image-limited');
    });
});
