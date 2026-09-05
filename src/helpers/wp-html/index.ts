'use client';

/**
 * Обработка HTML, который приходит из WordPress: санитизация плюс структурные
 * трансформации (спойлеры, картинки, чистка разметки).
 *
 * `'use client'` здесь потому, что конвейер опирается на `DOMParser`; на сервере
 * `pipeline` уходит в регекспный фолбэк. Для метатегов есть отдельный `@/helpers/wp-text`.
 */
export { getCleanEntry } from './clean';
export { createExcerpt } from './excerpt';
export { createTips } from './tips';
export { processHtml, applyTransforms } from './pipeline';
export type { HtmlTransform } from './types';
