import { HtmlTransform } from '../types';
import { processSpoilers } from './spoilers';
import { removeEmptyParagraphs } from './emptyParagraphs';
import { wrapLonelyImages } from './lonelyImages';
import { limitFigureWidth } from './figures';
import { collapseMultipleBreaks } from './breaks';

export { processSpoilers, removeEmptyParagraphs, wrapLonelyImages, limitFigureWidth, collapseMultipleBreaks };

/**
 * Порядок важен: спойлеры разворачиваются первыми, потому что их разметка содержит
 * параграфы, которые следующий шаг может счесть пустыми; картинки оборачиваются уже
 * по вычищенному дереву.
 */
export const TRANSFORMS: readonly HtmlTransform[] = [
    processSpoilers,
    removeEmptyParagraphs,
    wrapLonelyImages,
    limitFigureWidth,
    collapseMultipleBreaks,
];
