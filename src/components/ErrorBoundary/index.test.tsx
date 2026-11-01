import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ErrorBoundary from './index';

let shouldThrow = true;
const Bomb = () => {
    if (shouldThrow) throw new Error('бум');
    return <p>всё хорошо</p>;
};

describe('ErrorBoundary', () => {
    beforeEach(() => {
        shouldThrow = true;
        // React и сама граница пишут упавший рендер в консоль — в тестах это шум.
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => jest.restoreAllMocks());

    it('показывает запасной экран вместо упавшего содержимого', () => {
        render(<ErrorBoundary componentName="Test"><Bomb/></ErrorBoundary>);
        expect(screen.getByRole('alert')).toHaveTextContent('Что-то сломалось');
    });

    it('пишет имя компонента в консоль', () => {
        render(<ErrorBoundary componentName="Test"><Bomb/></ErrorBoundary>);
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('Error in component: Test'),
            expect.anything(), expect.anything(), expect.anything(),
        );
    });

    it('«Попробовать снова» перерисовывает содержимое без перезагрузки', () => {
        render(<ErrorBoundary componentName="Test"><Bomb/></ErrorBoundary>);
        shouldThrow = false;
        fireEvent.click(screen.getByRole('button', { name: 'Попробовать снова' }));
        expect(screen.getByText('всё хорошо')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('берёт свой fallback, если он передан', () => {
        render(<ErrorBoundary componentName="Test" fallback={<p>свой экран</p>}><Bomb/></ErrorBoundary>);
        expect(screen.getByText('свой экран')).toBeInTheDocument();
    });
});
