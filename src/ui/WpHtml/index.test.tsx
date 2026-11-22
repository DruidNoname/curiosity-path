import React from 'react';
import { render, screen } from '@testing-library/react';
import WpHtml from './index';

describe('WpHtml', () => {
    it('показывает разметку из WP', () => {
        render(<WpHtml html="<p>Шли <strong>лесом</strong></p>" />);
        expect(screen.getByText('лесом').tagName).toBe('STRONG');
    });

    it('вырезает скрипты и обработчики событий', () => {
        const { container } = render(
            <WpHtml html={'<p onclick="steal()">Текст</p><script>steal()</script><img src="x" onerror="steal()">'} />,
        );
        const html = container.innerHTML;
        expect(screen.getByText('Текст')).toBeInTheDocument();
        expect(html).not.toContain('<script');
        expect(html).not.toContain('onclick');
        expect(html).not.toContain('onerror');
        expect(html).not.toContain('steal');
    });

    it('не рендерит ничего, если после очистки пусто', () => {
        const { container } = render(<WpHtml html="<script>steal()</script>" />);
        expect(container).toBeEmptyDOMElement();
    });

    it('не рендерит ничего без HTML', () => {
        const { container } = render(<WpHtml html={undefined} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('prepare="excerpt" обрезает длинный анонс', () => {
        const long = `<p>${'лес '.repeat(100)}</p>`;
        const { container } = render(<WpHtml html={long} prepare="excerpt" maxLength={50} />);
        const text = container.textContent || '';
        expect(text.length).toBeLessThanOrEqual(50);
        expect(text.endsWith('...')).toBe(true);
    });

    it('prepare="tips" собирает советы из шорткодов в список и чистит их', () => {
        const notes = '[wprm-tip icon="lightbulb"]Тесто <script>steal()</script>не мять[/wprm-tip]<p>Подавать тёплым</p>';
        const { container } = render(<WpHtml html={notes} prepare="tips" />);
        expect(container.querySelector('ul li')?.textContent).toContain('не мять');
        expect(screen.getByText('Подавать тёплым')).toBeInTheDocument();
        expect(container.innerHTML).not.toContain('steal');
    });

    it('по умолчанию — div, а тег и класс можно задать', () => {
        const { container, rerender } = render(<WpHtml html="<p>Песня</p>" />);
        expect(container.firstElementChild?.tagName).toBe('DIV');

        rerender(<WpHtml html="<p>Песня</p>" component="h5" className="subtitle" />);
        expect(container.firstElementChild?.tagName).toBe('H5');
        expect(container.firstElementChild).toHaveClass('subtitle');
    });
});
