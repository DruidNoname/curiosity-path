'use client';

import React from 'react';
import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';
import { createExcerpt, createTips, getCleanEntry } from '@/helpers/wp-html';

/**
 * Как подготовить HTML:
 * - `entry` — `getCleanEntry`: тело записи, описание и шаги рецепта;
 * - `excerpt` — `createExcerpt`: то же плюс обрезка длинного анонса;
 * - `tips` — `createTips`: советы WP Recipe Maker из шорткодов `[wprm-tip]`.
 */
export type WpHtmlPrepare = 'entry' | 'excerpt' | 'tips';

type Props = Omit<TypographyProps, 'children' | 'dangerouslySetInnerHTML'> & {
    /** Сырой HTML из WordPress, как пришёл из API. Чистить заранее не нужно. */
    html: string | null | undefined;
    prepare?: WpHtmlPrepare;
    /** Предел длины анонса для `prepare="excerpt"`. */
    maxLength?: number;
};

const prepareHtml = (html: string, prepare: WpHtmlPrepare, maxLength?: number): string => {
    switch (prepare) {
        case 'excerpt':
            return createExcerpt(html, maxLength);
        case 'tips':
            return createTips(html);
        default:
            return getCleanEntry(html);
    }
};

/**
 * Единственное место, где HTML из WordPress попадает на страницу.
 *
 * Принимает сырой HTML и сам прогоняет его через конвейер `@/helpers/wp-html`,
 * поэтому забыть санитизацию нельзя. `dangerouslySetInnerHTML` в остальном коде
 * запрещён правилом eslint (`no-restricted-syntax`, см. `eslint.config.mjs`).
 *
 * Снаружи это `Typography`: принимает её пропсы (`variant`, `component`, `sx`,
 * `className`). По умолчанию — `div` без своей типографики, как обычный `Box`.
 * Если после очистки ничего не осталось, не рендерит ничего.
 */
const WpHtml: React.FC<Props> = ({ html, prepare = 'entry', maxLength, variant = 'inherit', component = 'div', ...rest }) => {
    // Конвейер дорогой (sanitize-html + DOMParser), а компонент перерисовывается
    // вместе с родителем — мемоизируем по входу. В списке у каждого элемента свой кеш.
    const clean = React.useMemo(
        () => prepareHtml(html || '', prepare, maxLength),
        [html, prepare, maxLength],
    );

    if (!clean) return null;

    return (
        <Typography
            {...rest}
            variant={variant}
            component={component}
            dangerouslySetInnerHTML={{ __html: clean }}
        />
    );
};

export default WpHtml;
