import { HtmlTransform } from '../types';

/**
 * Ограничивает фигуру с подписью шириной самой картинки, чтобы подпись не растягивалась
 * шире изображения.
 *
 * Ширина берётся только из атрибута `width`: раньше был фолбэк на число из класса
 * `wp-image-<id>`, но это идентификатор вложения в медиатеке, а не пиксели.
 */
export const limitFigureWidth: HtmlTransform = doc => {
    doc.querySelectorAll('figure').forEach(figure => {
        if (!figure.querySelector('figcaption')) return;

        const img = figure.querySelector('img');
        if (!img) return;

        const width = parseInt(img.getAttribute('width') || '', 10);
        if (!Number.isFinite(width) || width <= 0) return;

        // Ширина у каждой картинки своя, поэтому только она задаётся инлайном;
        // остальное висит на классе в styles/index.css.
        figure.style.maxWidth = `${width}px`;
        figure.classList.add('wp-image-limited');
    });
};
